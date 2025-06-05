import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import { API_CONFIG, handleApiError } from './config'
import { ApiResponse } from './types'

class HttpRequest {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 如果是blob响应，直接返回
        if (response.config.responseType === 'blob') {
          return response.data
        }

        const { code, message } = response.data
        if (code === 200) {
          return response.data
        }
        return Promise.reject(message)
      },
      (error) => {
        return handleApiError(error)
      }
    )
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config)
      return response as T
    } catch (error) {
      return Promise.reject(error)
    }
  }

  public get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET', url, params })
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST', url, data })
  }
}

export const http = new HttpRequest()
