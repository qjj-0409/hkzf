import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast
} from 'antd-mobile'

import NavHeader from '../../../components/NavHeader'
import HousePackge from '../../../components/HousePackage'

import styles from './index.module.css'
import request from '../../../utils/request'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: {
        name: '',
        id: ''
      },
      // 价格
      price: '',
      // 面积
      size: 0,
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  // 封装函数-获取value
  getValue = (name, val) => {
    // console.log('房屋name', name)
    // console.log('房屋value', val)
    this.setState({
      [name]: val
    })
  }

  // 封装函数-上传图片
  // (files: Object, operationType: string, index: number): void
  uploadImage = async (files, operationType, index) => {
    // console.log('图片数组files', files)
    // console.log('操作类型operationType', operationType)
    // console.log('删除索引index', index)
    // 图片预览
    this.setState({
      tempSlides: files
    })
    // 上传图片的逻辑：选择图片-上传到后台-后台返回一个url图片地址
    // 1.先判断有没有选择图片
    if (this.state.tempSlides.length > 0) {
      // 2.循环添加图片到FormData对象中
      let fd = new FormData()
      this.state.tempSlides.forEach(item => {
        let file = item.file
        // 追加到FormData对象中
        fd.append('file', file)
      })
      // 3.发请求上传图片
      let { data } = await request.post('/houses/image', fd, {
        'Content-Type': 'multipart/form-data'
      })
      // console.log('上传图片后的结果', data)
      this.setState({
        houseImg: data.body.join('|')
      })
    }
  }

  // 封装函数-提交表单
  addHouse = async () => {
    console.log('收集到的房屋信息', this.state)
    // 整理需要提交的房屋信息
    let houseInfo = {
      // 小区的名称和id
      community: this.state.community.id,
      // 价格
      price: this.state.price,
      // 面积
      size: this.state.size,
      // 房屋类型
      roomType: this.state.roomType,
      // 楼层
      floor: this.state.floor,
      // 朝向：
      oriented: this.state.oriented,
      // 房屋标题
      title: this.state.title,
      // 房屋图片
      houseImg: this.state.houseImg,
      // 房屋配套：
      supporting: this.state.supporting,
      // 房屋描述
      description: this.state.description
    }
    // 发布房源
    const { data } = await request.post('/user/houses', houseInfo)
    console.log('发布房源后的信息', data)
    // 发布房源成功
    if (data.status === 200) {
      // 提示
      Toast.success('发布房源成功', 1)
      // 跳转到房屋管理页面
      this.props.history.push('/rent')
    } else {
      Toast.fail('发布失败~~', 1)
    }
  }

  // 生命周期函数-初次渲染到页面
  componentDidMount() {
    // console.log('发布房源/rent/add的props', this.props)
    const { state } = this.props.location
    // 判断传来的state是否存在，如果存在，赋值给community
    if (state) {
      this.setState({
        community: {
          name: state.name,
          id: state.id
        }
      })
    }
  }

  // 生命周期函数-渲染到内存
  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        {/* 基本房源信息 */}
        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>

          {/* 租金 */}
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
            onChange={(val) => {
              this.getValue('price', val)
            }}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>

          {/* 建筑面积 */}
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={(val) => {
              this.getValue('size', val)
            }}
          >
            建筑面积
          </InputItem>

          {/* 户型 */}
          <Picker
            data={roomTypeData}
            value={[roomType]}
            cols={1}
            onChange={(val) => {
              this.getValue('roomType', val[0])
            }}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          {/* 所在楼层 */}
          <Picker
            data={floorData}
            value={[floor]}
            cols={1}
            onChange={(val) => {
              this.getValue('floor', val[0])
            }}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>

          {/* 朝向 */}
          <Picker
            data={orientedData}
            value={[oriented]}
            cols={1}
            onChange={(val) => {
              this.getValue('oriented', val[0])
            }}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        {/* 房屋标题 */}
        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(val) => {
              this.getValue('title', val)
            }}
          />
        </List>

        {/* 房屋图像 */}
        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
            onChange={this.uploadImage}
          />
        </List>

        {/* 房屋配置 */}
        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge
            select
            onSelect={(val) => {
              this.getValue('supporting', val.join('|'))
            }}
          />
        </List>

        {/* 房屋描述 */}
        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(val) => {
              this.getValue('description', val)
            }}
          />
        </List>

        {/* 取消/提交按钮 */}
        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
