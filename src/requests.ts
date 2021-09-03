process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import { username, password, url } from './constants';
import * as fetch from 'node-fetch';

export class Requests {

    private token: string;
    private stream: any;
	public certificatesNotUpdated: Set<string> = new Set();
    
    constructor(stream: any) {
        this.stream = stream;
    }

    public async requestToken() {
        const response = await fetch(`${url}/api/v1/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        let responseJson = await response.text();
        this.stream.write(`${new Date()} --- requestToken: ${responseJson}\n`);
        responseJson = JSON.parse(responseJson);
        this.token = responseJson.data.token;
        this.stream.write(`${new Date()} --- Token: ${this.token}\n`);
        return this.token;
    }

    public async getCertificates() {
        const response = await fetch(`${url}/ms-certificate/api/v1/certificate/find-all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token,
                'Role': 'ROLE_2'
            }
        });
        let responseJson = await response.text();
        this.stream.write(`${new Date()} --- getCertificates: ${responseJson}\n`);
        responseJson = JSON.parse(responseJson);
    
        this.stream.write(`${new Date()} --- Certificates response: ${JSON.stringify(responseJson)}\n`);
        return responseJson.data;
    }
 
   
 

    public async updateState(id: string) {
        try {
            const response = await fetch(`${url}/ms-certificate/api/v1/certificate/update-state/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    codeStatus: '24',
                    message: 'Vigencia Expirada actualizada por CRON'
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token,
                    'Role': 'ROLE_3'
                }
            });
            const responseJson = await response.text();
            if (response.ok) {
                this.stream.write(`${new Date()} --- updateState:${id}, ${responseJson}\n`);
            } else {
                this.stream.write(`${new Date()} --- ERROR.updateState:${id}, ${responseJson}\n`);
            }
            const responseObj = JSON.parse(responseJson);
            if (responseObj.status == 200) {
                this.stream.write(`${new Date()} --- Update certificate ${id}, response: ${responseJson}\n`);
            }
            return responseObj;
        } catch (error) {
            this.stream.write(`${new Date()} --- ERROR.updateState:${id}, ${error?.message}\n`);
            return {};
        }
    }
}