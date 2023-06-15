import tokenAxios from "@/interceptor/tokenAxios";

const BASE_BOOK_ULR = "http://127.0.0.1:3000/library"

export default {
  async fetchAll(): Promise<Array<string>> {
    const resp = await tokenAxios.get(BASE_BOOK_ULR + "/");
    return resp.data;
  }
}