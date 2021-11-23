
import axios from 'axios';
const runSQL = async(token:string) => {
    const sql = 'SELECT * FROM cc_payments';
    const url = `http://localhost:3030/api/ws/v2/sql/execute?sql=${sql}&stats=2&offsets=false&live=false`;
    const result = await axios.get(url, { 'headers': { 'X-Kafka-Lenses-Token': token } });
    console.log('result ', result);
}
export {runSQL};