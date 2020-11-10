import axios from 'axios';


const client = ({req}) => {

    if (typeof window === 'undefined') {
        // We are on the server
    
        return axios.create({
            baseURL: 'http://ticket-cocaco.com',
            headers: req.headers
        });
      } else {
        // We must be on the browser
        return axios.create({
          baseUrl: '/'
        });
      }
} 

export default client;
