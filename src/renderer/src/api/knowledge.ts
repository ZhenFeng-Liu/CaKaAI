import { http } from './request'

export const knowledgeApi = {
  getKnowledgeBases: (data?: any) => http.post('/Knowledge/Query', data),
  addKnowledgeBase: (data: any) => http.post('/Knowledge/Add', data),
  updateKnowledgeBase: (data: any) => http.post('/Knowledge/Update', data),
  deleteKnowledgeBase: (data: any) => http.post('/Knowledge/Delete', data),
  addKnowledgeItem: (data: any) => http.post('/KnowledgeItem/Add', data),
  deleteKnowledgeItem: (data: any) => http.post('/KnowledgeItem/Delete', data)
}
