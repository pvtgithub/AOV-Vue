export class AuthenticateUtil {

    static setJwtToSession(jwt : string) {
        if(jwt){
            localStorage.setItem('access_token', jwt);
        }
    }
    static getJwtFromSession(){
        const jwt = localStorage.getItem('access_token');
        if(jwt){
            return jwt
        }
    }
    static removeJwtFromSession(){
        localStorage.removeItem('access_token');
        localStorage.removeItem('payloadUser');

    }
    static checkJwt() : boolean { 
        const jwt = this.getJwtFromSession();
        const payload = this.parseJwt(jwt);
        if(!payload || Date.now() >= payload.exp * 1000){
            this.removeJwtFromSession()
            return false
        }
        return true
    }

    static parseJwt(token: any): any {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
        
          return JSON.parse(jsonPayload);
        } catch(e) {
          return null;
        }
      }
}