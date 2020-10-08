import axios from "axios";

const apiPrefix = 'https://stock.nightc.com/api/';

export default {
    async searchStock(query: string) {
        try{
            const resp = await axios.ge