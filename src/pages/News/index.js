import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import NewsList from '../../components/NewsList'
import './index.scss'

export default class News extends Component {
//   // 生命周期-初始化
//   state = {
//     news: [], // 最新资讯
//     currentCity: getCurrentCity()
//   }

//   // 封装函数-获取最新资讯数据
//   async getNews () {
//     const { data } = await request.get(`/home/news?area=${this.state.currentCity.value}`)
//     // console.log(data.body)
//     this.setState({
//       news: data.body
//     })
//   }

//   // 封装函数-渲染最新资讯
//   renderNews () {
//     return this.state.news.map(item => {
//       return (
//         <li className="item" key={item.id}>
//           <img src={`http://api-haoke-web.itheima.net${item.imgSrc}`} alt=""/>
//           <div className="item-right">
//             <h3>{item.title}</h3>
//             <p>
//               <span>{item.from}</span>
//               <span>{item.date}</span>
//             </p>
//           </div>
//         </li>
//       )
//     })
//   }

//   // 生命周期函数-初次渲染到页面
//   componentDidMount() {
//     this.getNews()
//   }


  // 生命周期函数-渲染到内存
  render() {
    return (
      <div className='newsIndex'>
        <NavHeader>资讯</NavHeader>
        <NewsList></NewsList>
        {/* <ul>
          调用函数-渲染最新资讯
          { this.renderNews() }
        </ul> */}
      </div>
    )
  }
}
