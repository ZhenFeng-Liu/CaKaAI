获取询价记录接口接口：http://192.168.0.111:9919/api/v1/query-enquiry
get请求
请求参数
{
    userId: 11
}

userId字段的参数来自localStorage.getItem('userInfo')中的userInfo.uid
