import request from '@/utils/request'
import Config from '@/config'

export default {
    async list(path) {
      const { data } = await request.get(`${Config.endpoints.wiener}/api/execute/listfolderbase64`, {
        params: {
            folderpath: btoa(path)
        }
      })
      return data
    },
    async mkdir(path) {
        const { data } = await request.get(`${Config.endpoints.wiener}/api/execute/makedirbase64`, {
            params: {
                folderpath: btoa(path)
            }
        })
        return data
        // return {path: path}
    },
    async delete(path) {
        const { data } = await request.get(`${Config.endpoints.wiener}/api/execute/deletebase64`, {
            params: {
                fileslist: btoa(path)
            }
        })
        return data
        // return {path: path}
    },
    async copy(usermail, sources, dest, parallel) {
        const { data } = await request.get(`${Config.endpoints.wiener}/api/execute/copybase64`, {
            params: {
                usermail: usermail,
                sources: btoa(sources),
                dest: btoa(dest),
                parallel: parallel
            }
        })
        return data
        // return {source: src, dest: dest}
    }
}
  