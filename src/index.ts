import * as chalk from 'chalk';
import * as moment from 'moment';
import { Requests } from './requests';
import { dateFormat, timeoutUpdateState, timeoutGeneral, logFileName, maxRetry, countryCode } from './constants';
const fs = require('fs');

namespace Cadena {


    class ClientCode {

        private requests: Requests;
        private stream;
        private date: Date;

        constructor() {
        }

        public async initConstants() {
            
			this.stream = fs.createWriteStream(logFileName, { flags: 'a' });
            this.requests = new Requests(this.stream);
            this.date = new Date();
		    await this.requests.requestToken();
            
        }

        public async startProcess(): Promise<void> {
            
			//await this.initConstants();
            
			let dataOeas = await this.requests.getCertificates();
			
			for (let OEA of dataOeas){
			
			     if(OEA.valideDate){
					 
				    //console.log(`OEA: ${OEA.id}  ${OEA.valideDate}  ${OEA.statusOEA.code} \n`);
					
					if(moment(OEA.valideDate).isBefore(moment())  &&  OEA.statusOEA.code == '10' && !OEA.edit && OEA.country.code == countryCode){
					 
				       //console.log(`OEA con fecha vencida`);
					   
					   for (let i = 0; i < maxRetry; i++) {
						   
							var responseObj = await this.requests.updateState(OEA.id);
							await this.sleep(timeoutUpdateState);
							
							if (responseObj?.status == 200) {
								
								console.log(`TIN: ${OEA.tradeIdentificationNumber}  => Certificate ID update ${OEA.id} \n`);
								
								break;
							}
							
							this.stream.write(`RETRY : TIN: ${OEA.tradeIdentificationNumber} => ${OEA.id}: ${responseObj?.status}\n`);
						
                        }
					   
				    }
				 
				 }
				
			}
			
            totalOeas = dataOeas.length;			
			
			this.stream.write(`total: ${totalOeas}\n`);

            await this.finishProcess();
        }

        private async finishProcess() {
            this.stream.end();
        }

        private sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }

        private async refreshToken() {
            const difference = new Date().getTime() - this.date.getTime();
            const minutesDifference = Math.floor(difference / 1000 / 60);
            if (minutesDifference > 30) {
                console.log("call->refreshToken");
                await this.requests.requestToken();
                this.date = new Date();
            }
        }
    }
    // * -----------------------------------------------------------------------------------
    let totalOeas = 0;
	console.log(chalk.greenBright.bold('Proceso iniciado'));    
	
    const client = new ClientCode();	
	//let dataOeas: [{ id: string, shortName: string, certificateDate: string , valideDate: string, tradeIdentificationNumber: string  }?] = [];
	client.initConstants()
    .then(() => client.startProcess())
    .then(() => {
        console.log(chalk.greenBright.bold(`Completado!!`));
    })
    .catch(console.trace);
	
	
        

}
