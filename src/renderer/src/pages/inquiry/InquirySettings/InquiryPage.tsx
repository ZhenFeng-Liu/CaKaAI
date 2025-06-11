import { AntDesignOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Scrollbar from '@renderer/components/Scrollbar'
import Markdown from '@renderer/pages/home/Markdown/Markdown'
import {
  Button,
  Checkbox,
  Collapse,
  ConfigProvider,
  Divider,
  Empty,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space
} from 'antd'
import { createStyles } from 'antd-style'
import { debounce } from 'lodash'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  badgeLanyardEnquiry,
  penEnquiry,
  roomCardEnquiry,
  sixSmallItemsEnquiry,
  slipperEnquiry,
  umbrellaEnquiry
} from '../api/enquiry'
import { queryProdTypeParams } from '../api/query_prodtype_params'

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `
}))

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: calc(100vh - var(--navbar-height));
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 100%;
`

const TableContainer = styled(Scrollbar)`
  padding: 15px;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

const SideNav = styled.div`
  width: calc(var(--assistants-width) + 250px);
  border-right: 0.5px solid var(--color-border);
  padding: 12px;
  user-select: none;
  display: flex;
  flex-direction: column;
  height: 100%;

  .sidenav-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .bottom-action {
    margin-top: auto;
  }

  .ant-menu {
    border-inline-end: none !important;
    background: transparent;
  }

  .ant-menu-item {
    height: 36px;
    line-height: 36px;
    margin: 4px 0;
    width: 100%;
    border-radius: var(--list-item-border-radius);
    border: 0.5px solid transparent;

    &:hover {
      background-color: var(--color-background-soft) !important;
    }

    &.ant-menu-item-selected {
      background-color: var(--color-background-soft);
      color: var(--color-primary);
      border: 0.5px solid var(--color-border);
      color: var(--color-text);
    }
  }
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  border-radius: 8px;
`

const ProgressBar = styled.div`
  width: 200px;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
`

const ProgressFill = styled.div`
  height: 100%;
  background: #000;
  transition: width 0.3s ease;
  border-radius: 4px;
`

const LoadingText = styled.div`
  color: #a0a0a0;
  font-size: 14px;
`

const MarkdownContainer = styled.div`
  position: relative;
  font-size: 15px;
  line-height: 1.8;
  color: ${(props) => props.theme.colorText};
  background: ${(props) => props.theme.colorBgContainer};
  border-radius: 8px;
  padding: 32px;
  border: 0.5px solid var(--color-border);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colorBorder};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.colorBgLayout};
  }

  &.typing {
    &::after {
      content: '|';
      display: inline-block;
      animation: blink 1s step-end infinite;
      color: ${(props) => props.theme.colorPrimary};
      font-weight: bold;
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  h1,
  h2,
  h3 {
    font-weight: 600;
    margin: 0 0 24px 0;
    color: ${(props) => props.theme.colorTextHeading};
    border-bottom: 2px solid ${(props) => props.theme.colorBorderSecondary};
    padding-bottom: 12px;
  }

  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 20px;
  }
  h3 {
    font-size: 16px;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    margin: 16px 0;
  }

  li {
    margin: 8px 0;
    padding-left: 24px;
    position: relative;

    &:before {
      content: '•';
      position: absolute;
      left: 8px;
      color: ${(props) => props.theme.colorPrimary};
    }
  }

  strong {
    color: ${(props) => props.theme.colorTextHeading};
    font-weight: 600;
  }

  pre {
    background: ${(props) => props.theme.colorBgLayout};
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
  }

  code {
    background: ${(props) => props.theme.colorBgLayout};
    padding: 2px 4px;
    border-radius: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 14px;
    border: 1px solid ${(props) => props.theme.colorBorder};
    table-layout: fixed;
  }

  th,
  td {
    border: 1px solid ${(props) => props.theme.colorBorder};
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: ${(props) => props.theme.colorBgLayout};
    font-weight: 600;
  }
`

const useStyles = createStyles(({ token }) => ({
  detailContainer: {
    padding: token.padding,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    boxShadow: token.boxShadowSecondary
  },
  detailForm: {
    maxWidth: 600,
    margin: '0 auto',
    '& .ant-form-item': {
      marginBottom: token.marginLG
    },
    '& .ant-form-item-label': {
      fontWeight: 500
    },
    '& .ant-radio-group': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: token.paddingXS
    },
    '& .ant-checkbox-group': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: token.paddingXS
    },
    '& .ant-form-item-control-input': {
      minHeight: 'auto'
    }
  },
  saveButton: {
    marginTop: token.marginLG
  }
}))

const CategoryRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .ant-radio-button-wrapper {
    margin-right: 0;
    border-radius: 4px;
    border: 1px solid var(--color-border);

    &:not(:first-child)::before {
      display: none;
    }

    &:hover {
      color: var(--color-primary);
    }

    &.ant-radio-button-wrapper-checked {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;

      &:hover {
        color: white;
      }
    }
  }
`

// 定义品类类型：品类：slipper--拖鞋、room_card--房卡、pen--环保笔、umbrella--伞、badge_lanyard--胸牌、six_small_items--六小件
type CategoryType = 'room_card' | 'slipper' | 'pen' | 'badge_lanyard' | 'umbrella' | 'six_small_items'

// 定义品类数据接口
interface CategoryItem {
  key: string
  label: string
  category: CategoryType
  material: string
  thickness?: string
  length?: number
  width?: number
  process?: string[]
  chip?: string
  encrypted?: string
  // 拖鞋特有字段
  texture?: string
  size?: string
  craft?: string[]
  packaging?: string
  // 胸牌特有字段
  name?: string
  // 雨伞特有字段
  boneNum?: string
  handShank?: string
  selectedUmbrellaName?: string // 添加雨伞名称字段
  // 六小件特有字段
  weight?: string
  children: React.ReactNode
  extra: React.ReactNode | null
}

// 定义品类选项
const CATEGORY_OPTIONS = [
  { label: '房卡', value: 'room_card' },
  { label: '拖鞋', value: 'slipper' },
  { label: '环保笔', value: 'pen' },
  { label: '胸牌', value: 'badge_lanyard' },
  { label: '雨伞', value: 'umbrella' },
  { label: '六小件', value: 'six_small_items' }
]

// 房卡相关常量数据
const ROOM_CARD_DATA = {}

// 拖鞋相关常量数据
const SLIPPER_DATA = {
  textures: [
    { key: 'L1', value: '拉毛布+EVA底', label: '拉毛布+EVA底' },
    { key: 'L2', value: '珊瑚绒+EVA底', label: '珊瑚绒+EVA底' },
    { key: 'L3', value: '全粘胶珍珠棉+甘蔗底', label: '全粘胶珍珠棉+甘蔗底' },
    { key: 'L4', value: '真美布+软木底', label: '真美布+软木底' }
  ],
  sizes: {
    L1: [{ label: '28.5*11.5', value: '28.5*11.5' }],
    L2: [{ label: '29*11.5', value: '29*11.5' }],
    L3: [
      { label: '29*11.5', value: '29*11.5' },
      { label: '29.7*11.5', value: '29.7*11.5' },
      { label: '30.5*11.8', value: '30.5*11.8' }
    ],
    L4: [{ label: '30*12.3', value: '30*12.3' }]
  },
  crafts: {
    L1: [
      { label: '单色丝印', value: '单色丝印' },
      { label: '双色丝印', value: '双色丝印' },
      { label: '单色胶印', value: '单色胶印' },
      { label: '双色胶印', value: '双色胶印' },
      { label: '车花logo', value: '车花logo' }
    ],
    L2: [
      { label: '单色胶印', value: '单色胶印' },
      { label: '双色胶印', value: '双色胶印' },
      { label: '车花logo', value: '车花logo' }
    ],
    L3: [
      { label: '单色胶印', value: '单色胶印' },
      { label: '双色胶印', value: '双色胶印' },
      { label: '车花logo', value: '车花logo' }
    ],
    L4: [
      { label: '单色胶印', value: '单色胶印' },
      { label: '双色胶印', value: '双色胶印' },
      { label: '车花logo', value: '车花logo' }
    ]
  },
  packaging: [
    { label: '无纺布袋', value: '无纺布袋' },
    { label: '欧根纱袋', value: '欧根纱袋' },
    { label: 'OPP袋', value: 'OPP袋' },
    { label: '纸盒', value: '纸盒' }
  ]
}

// 环保笔相关常量数据
const PEN_DATA = {
  textures: [
    {
      key: 'L1',
      value: '竹子-GCSEP-102',
      label: '竹子-GCSEP-102'
    },
    {
      key: 'L2',
      value: '竹子-GCSEP-103',
      label: '竹子-GCSEP-103'
    },
    {
      key: 'L3',
      value: '纸杆-GCSEP-101',
      label: '纸杆-GCSEP-101'
    },
    {
      key: 'L4',
      value: '纸杆-GCSEP-104',
      label: '纸杆-GCSEP-104'
    },
    {
      key: 'L5',
      value: '纸杆-GCSEP-107',
      label: '纸杆-GCSEP-107'
    }
  ],
  sizes: {
    L1: [
      {
        label: '138*11.11',
        value: '138*11.11'
      }
    ],
    L2: [
      {
        label: '143*(上杆12.44,下杆11.04)',
        value: '143*(上杆12.44,下杆11.04)'
      }
    ],
    L3: [
      {
        label: '142*9.83',
        value: '142*9.83'
      }
    ],
    L4: [
      {
        label: '134*9.94',
        value: '134*9.94'
      }
    ],
    L5: [
      {
        label: '133.5*7.44',
        value: '133.5*7.44'
      }
    ]
  },
  crafts: {
    L1: [
      {
        label: '大印刷',
        value: '大印刷'
      },
      {
        label: '小印刷',
        value: '小印刷'
      },
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L2: [
      {
        label: '大印刷',
        value: '大印刷'
      },
      {
        label: '小印刷',
        value: '小印刷'
      },
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L3: [
      {
        label: '大印刷',
        value: '大印刷'
      },
      {
        label: '小印刷',
        value: '小印刷'
      }
    ],
    L4: [
      {
        label: '大印刷',
        value: '大印刷'
      },
      {
        label: '小印刷',
        value: '小印刷'
      }
    ],
    L5: [
      {
        label: '大印刷',
        value: '大印刷'
      },
      {
        label: '小印刷',
        value: '小印刷'
      }
    ]
  }
}

// 胸牌相关常量数据
const BADEG_LANYARD_DATA = {
  names: [
    {
      key: 'L1',
      value: '金属胸章（定制，长方形，扣针款）',
      label: '金属胸章（定制，长方形，扣针款）'
    },
    {
      key: 'L2',
      value: '金属胸章（定制，长方形，磁吸款）',
      label: '金属胸章（定制，长方形，磁吸款）'
    },
    {
      key: 'L3',
      value: '空白金属胸章（定制，长方形，扣针款）',
      label: '空白金属胸章（定制，长方形，扣针款）'
    },
    {
      key: 'L4',
      value: '空白金属胸章（定制，长方形，磁吸款）',
      label: '空白金属胸章（定制，长方形，磁吸款）'
    },
    {
      key: 'L5',
      value: '金属磁铁扣徽章-绿头鸭',
      label: '金属磁铁扣徽章-绿头鸭'
    },
    {
      key: 'L6',
      value: '金属磁铁扣徽章-小鹌鹑',
      label: '金属磁铁扣徽章-小鹌鹑'
    },
    {
      key: 'L7',
      value: '金属磁铁扣徽章-鸳鸯',
      label: '金属磁铁扣徽章-鸳鸯'
    },
    {
      key: 'L8',
      value: '定制胸牌UV印刷-磁吸款',
      label: '定制胸牌UV印刷-磁吸款'
    },
    {
      key: 'L9',
      value: '定制胸牌UV印刷-别针款',
      label: '定制胸牌UV印刷-别针款'
    },
    {
      key: 'L10',
      value: '金属胸章（定制，异形，配色蝴蝶背扣）',
      label: '金属胸章（定制，异形，配色蝴蝶背扣）'
    },
    {
      key: 'L11',
      value: '金属胸章（定制，长方形，强磁吸背扣）',
      label: '金属胸章（定制，长方形，强磁吸背扣）'
    }
  ],
  sizes: {
    L1: [
      {
        label: '1.56*6.25mm',
        value: '1.56*6.25mm'
      }
    ],
    L2: [
      {
        label: '1.56*6.25mm',
        value: '1.56*6.25mm'
      }
    ],
    L3: [
      {
        label: '1.56*6.25mm',
        value: '1.56*6.25mm'
      }
    ],
    L4: [
      {
        label: '1.56*6.25mm',
        value: '1.56*6.25mm'
      }
    ],
    L5: [
      {
        label: '定制',
        value: '定制'
      }
    ],
    L6: [
      {
        label: '定制',
        value: '定制'
      }
    ],
    L7: [
      {
        label: '定制',
        value: '定制'
      }
    ],
    L8: [
      {
        label: '定制',
        value: '定制'
      }
    ],
    L9: [
      {
        label: '定制',
        value: '定制'
      }
    ],
    L10: [
      {
        label: '10*15mm',
        value: '10*15mm'
      }
    ],
    L11: [
      {
        label: '80*18mm',
        value: '80*18mm'
      }
    ]
  },
  crafts: {
    L1: [
      {
        label: '切割|黑',
        value: '切割|黑'
      }
    ],
    L2: [
      {
        label: '切割|黑',
        value: '切割|黑'
      }
    ],
    L3: [
      {
        label: '切割',
        value: '切割'
      }
    ],
    L4: [
      {
        label: '切割',
        value: '切割'
      }
    ],
    L5: [
      {
        label: '锌合金印刷',
        value: '锌合金印刷'
      }
    ],
    L6: [
      {
        label: '锌合金印刷',
        value: '锌合金印刷'
      }
    ],
    L7: [
      {
        label: '锌合金印刷',
        value: '锌合金印刷'
      }
    ],
    L8: [
      {
        label: '切割UV印刷',
        value: '切割UV印刷'
      }
    ],
    L9: [
      {
        label: '切割UV印刷',
        value: '切割UV印刷'
      }
    ],
    L10: [
      {
        label: '切割电镀凹凸logo',
        value: '切割电镀凹凸logo'
      }
    ],
    L11: [
      {
        label: '切割电镀凹凸logo',
        value: '切割电镀凹凸logo'
      }
    ]
  }
}

// 伞相关常量数据
const UMBRELLA_DATA = {
  names: [
    {
      key: 'L1',
      value: '12骨灰色弯柄雨伞',
      label: '12骨灰色弯柄雨伞'
    },
    {
      key: 'L2',
      value: '8骨黑色弯柄雨伞（木中柱+木手柄+木伞珠）',
      label: '8骨黑色弯柄雨伞（木中柱+木手柄+木伞珠）'
    },
    {
      key: 'L3',
      value: '8骨蓝色弯柄雨伞（黄色包边）',
      label: '8骨蓝色弯柄雨伞（黄色包边）'
    },
    {
      key: 'L4',
      value: '24骨黑色弯柄雨伞',
      label: '24骨黑色弯柄雨伞'
    },
    {
      key: 'L5',
      value: '8骨绿色弯柄雨伞（木中柱+木手柄+塑料伞珠）',
      label: '8骨绿色弯柄雨伞（木中柱+木手柄+塑料伞珠）'
    },
    {
      key: 'L6',
      value: '8骨绿色弯柄雨伞（木中柱+木手柄+木质伞珠）',
      label: '8骨绿色弯柄雨伞（木中柱+木手柄+木质伞珠）'
    },
    {
      key: 'L7',
      value: '23英寸8骨',
      label: '23英寸8骨'
    },
    {
      key: 'L8',
      value: '16骨黑色弯柄雨伞（木中柱+木手柄+木伞珠）',
      label: '16骨黑色弯柄雨伞（木中柱+木手柄+木伞珠）'
    }
  ],
  textures: {
    L1: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L2: [
      {
        label: '木质',
        value: '木质'
      }
    ],
    L3: [
      {
        label: '塑料',
        value: '塑料'
      }
    ],
    L4: [
      {
        label: '塑料',
        value: '塑料'
      }
    ],
    L5: [
      {
        label: '塑料',
        value: '塑料'
      }
    ],
    L6: [
      {
        label: '木质',
        value: '木质'
      }
    ],
    L7: [
      {
        label: '塑料',
        value: '塑料'
      }
    ],
    L8: [
      {
        label: '木质',
        value: '木质'
      }
    ]
  },
  sizes: {
    L1: [
      {
        label: '27英寸',
        value: '27英寸'
      }
    ],
    L2: [
      {
        label: '27英寸',
        value: '27英寸'
      }
    ],
    L3: [
      {
        label: '27英寸',
        value: '27英寸'
      }
    ],
    L4: [
      {
        label: '21英寸',
        value: '21英寸'
      }
    ],
    L5: [
      {
        label: '27英寸',
        value: '27英寸'
      }
    ],
    L6: [
      {
        label: '27英寸',
        value: '27英寸'
      }
    ],
    L7: [
      {
        label: '23英寸',
        value: '23英寸'
      }
    ],
    L8: [
      {
        label: '27英寸',
        value: '27英寸'
      }
    ]
  },
  boneNums: {
    L1: [
      {
        label: '12',
        value: '12'
      }
    ],
    L2: [
      {
        label: '8',
        value: '8'
      }
    ],
    L3: [
      {
        label: '8',
        value: '8'
      }
    ],
    L4: [
      {
        label: '24',
        value: '24'
      }
    ],
    L5: [
      {
        label: '8',
        value: '8'
      }
    ],
    L6: [
      {
        label: '8',
        value: '8'
      }
    ],
    L7: [
      {
        label: '8',
        value: '8'
      }
    ],
    L8: [
      {
        label: '16',
        value: '16'
      }
    ]
  },
  handShanks: {
    L1: [
      {
        label: '塑料弯柄',
        value: '塑料弯柄'
      }
    ],
    L2: [
      {
        label: '木质弯柄',
        value: '木质弯柄'
      }
    ],
    L3: [
      {
        label: '塑料弯柄',
        value: '塑料弯柄'
      }
    ],
    L4: [
      {
        label: '皮质弯柄',
        value: '皮质弯柄'
      }
    ],
    L5: [
      {
        label: '木质弯柄',
        value: '木质弯柄'
      }
    ],
    L6: [
      {
        label: '木质弯柄',
        value: '木质弯柄'
      }
    ],
    L7: [
      {
        label: '塑料弯柄',
        value: '塑料弯柄'
      }
    ],
    L8: [
      {
        label: '木质弯柄',
        value: '木质弯柄'
      }
    ]
  },
  crafts: {
    L1: [
      {
        label: '单色一片印刷',
        value: '单色一片印刷'
      }
    ],
    L2: [
      {
        label: '单色两片印刷',
        value: '单色两片印刷'
      }
    ],
    L3: [
      {
        label: '单色两片印刷',
        value: '单色两片印刷'
      }
    ],
    L4: [
      {
        label: '单色两片印刷',
        value: '单色两片印刷'
      }
    ],
    L5: [
      {
        label: '单色两片印刷',
        value: '单色两片印刷'
      }
    ],
    L6: [
      {
        label: '单色两片印刷',
        value: '单色两片印刷'
      }
    ],
    L7: [
      {
        label: '单色两片印刷',
        value: '单色两片印刷'
      }
    ],
    L8: [
      {
        label: '单色两片印刷',
        value: '单色两片印刷'
      }
    ]
  }
}

// 六小件相关常量数据
const SIX_SMALL_ITEMS_DATA = {
  names: [
    {
      key: 'L1',
      label: '六小件-牙刷款式1（成人款）-竹木-190*15*5.25mm',
      value: '六小件-牙刷款式1（成人款）-竹木-190*15*5.25mm'
    },
    {
      key: 'L2',
      label: '六小件-牙刷款式2（儿童款）-竹木-140*15*9mm',
      value: '六小件-牙刷款式2（儿童款）-竹木-140*15*9mm'
    },
    {
      key: 'L3',
      label: '六小件-牙刷款式3（成人款）-竹木-183*11*5.5mm',
      value: '六小件-牙刷款式3（成人款）-竹木-183*11*5.5mm'
    },
    {
      key: 'L4',
      label: '六小件-牙刷款式4（儿童款）-竹木-142*8*5.25mm',
      value: '六小件-牙刷款式4（儿童款）-竹木-142*8*5.25mm'
    },
    {
      key: 'L5',
      label: '六小件-牙刷款式7（儿童款）-竹木-145*12*5mm',
      value: '六小件-牙刷款式7（儿童款）-竹木-145*12*5mm'
    },
    {
      key: 'L6',
      label: '六小件-牙刷款式5-麦秸秆-平尾180*10.5*8.5mm',
      value: '六小件-牙刷款式5-麦秸秆-平尾180*10.5*8.5mm'
    },
    {
      key: 'L7',
      label: '六小件-牙刷款式6-麦秸秆-尖尾165*11*8mm',
      value: '六小件-牙刷款式6-麦秸秆-尖尾165*11*8mm'
    },
    {
      key: 'L8',
      label: '六小件-牙膏-旋盖洁诺-英文版5g',
      value: '六小件-牙膏-旋盖洁诺-英文版5g'
    },
    {
      key: 'L9',
      label: '六小件-牙膏-旋盖阿妹-英文版6g',
      value: '六小件-牙膏-旋盖阿妹-英文版6g'
    },
    {
      key: 'L10',
      label: '六小件-牙膏-纸袋无品牌-英文版3g',
      value: '六小件-牙膏-纸袋无品牌-英文版3g'
    },
    {
      key: 'L11',
      label: '六小件-牙膏-旋盖高露洁-英文版5g',
      value: '六小件-牙膏-旋盖高露洁-英文版5g'
    },
    {
      key: 'L12',
      label: '六小件-牙膏-旋盖格瑞宝-英文版6g',
      value: '六小件-牙膏-旋盖格瑞宝-英文版6g'
    },
    {
      key: 'L13',
      label: '六小件-梳子款式1-竹木-135*30mm',
      value: '六小件-梳子款式1-竹木-135*30mm'
    },
    {
      key: 'L14',
      label: '六小件-梳子款式2-竹木-140*30mm',
      value: '六小件-梳子款式2-竹木-140*30mm'
    },
    {
      key: 'L15',
      label: '六小件-梳子款式3-竹木-气垫155*47mm',
      value: '六小件-梳子款式3-竹木-气垫155*47mm'
    },
    {
      key: 'L16',
      label: '六小件-梳子款式4-麦秸秆-全齿128*35*6mm',
      value: '六小件-梳子款式4-麦秸秆-全齿128*35*6mm'
    },
    {
      key: 'L17',
      label: '六小件-梳子款式5-麦秸秆-手柄185*27*5mm',
      value: '六小件-梳子款式5-麦秸秆-手柄185*27*5mm'
    },
    {
      key: 'L18',
      label: '六小件-梳子款式6-麦秸秆-折叠梳97*28*17mm',
      value: '六小件-梳子款式6-麦秸秆-折叠梳97*28*17mm'
    },
    {
      key: 'L19',
      label: '六小件-梳子款式7-麦秸秆-半齿155*32*4mm',
      value: '六小件-梳子款式7-麦秸秆-半齿155*32*4mm'
    },
    {
      key: 'L20',
      label: '六小件-剃须刀款式1-银色刀头-132*17mm',
      value: '六小件-剃须刀款式1-银色刀头-132*17mm'
    },
    {
      key: 'L21',
      label: '六小件-剃须刀款式2-麦秸杆刀头-130*15mm',
      value: '六小件-剃须刀款式2-麦秸杆刀头-130*15mm'
    },
    {
      key: 'L22',
      label: '六小件-剃须刀款式3-全麦秸秆直边-100*40*20mm',
      value: '六小件-剃须刀款式3-全麦秸秆直边-100*40*20mm'
    },
    {
      key: 'L23',
      label: '六小件-剃须刀款式4--全麦秸曲边-119*40*20mm',
      value: '六小件-剃须刀款式4--全麦秸曲边-119*40*20mm'
    },
    {
      key: 'L24',
      label: '六小件-剃须膏-旋盖无品牌-英文版10g',
      value: '六小件-剃须膏-旋盖无品牌-英文版10g'
    },
    {
      key: 'L25',
      label: '六小件-剃须膏-纸袋无品牌-英文版10g',
      value: '六小件-剃须膏-纸袋无品牌-英文版10g'
    },
    {
      key: 'L26',
      label: '六小件-剃须膏-旋盖多芬-英文版10g',
      value: '六小件-剃须膏-旋盖多芬-英文版10g'
    },
    {
      key: 'L27',
      label: '可降解内膜袋(牙刷) 4.4*20+2.6CM  0.06PLA+PBAT',
      value: '可降解内膜袋(牙刷) 4.4*20+2.6CM  0.06PLA+PBAT'
    },
    {
      key: 'L28',
      label: '可降内膜袋(梳子)4*15+2.6cm 0.06PLA+PBAT',
      value: '可降内膜袋(梳子)4*15+2.6cm 0.06PLA+PBAT'
    },
    {
      key: 'L29',
      label: '可降解内膜袋(剃须刀)7*15+3cm 0.06PLA+PBAT',
      value: '可降解内膜袋(剃须刀)7*15+3cm 0.06PLA+PBAT'
    },
    {
      key: 'L30',
      label: '六小件-瓦楞纸箱-47*30*21cm',
      value: '六小件-瓦楞纸箱-47*30*21cm'
    },
    {
      key: 'L31',
      label: '六小件-牙刷牛皮纸盒-无印刷通用款-195*31*16mm',
      value: '六小件-牙刷牛皮纸盒-无印刷通用款-195*31*16mm'
    },
    {
      key: 'L32',
      label: '六小件-剃须刀牛皮纸盒-无印刷通用款-136*51*25mm',
      value: '六小件-剃须刀牛皮纸盒-无印刷通用款-136*51*25mm'
    },
    {
      key: 'L33',
      label: '六小件-梳子牛皮纸盒-无印刷通用款-156*42*11mm',
      value: '六小件-梳子牛皮纸盒-无印刷通用款-156*42*11mm'
    }
  ],
  textures: {
    L1: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L2: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L3: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L4: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L5: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L6: [
      {
        label: '麦秸秆',
        value: '麦秸秆'
      }
    ],
    L7: [
      {
        label: '麦秸秆',
        value: '麦秸秆'
      }
    ],
    L8: [
      {
        label: '旋盖',
        value: '旋盖'
      }
    ],
    L9: [
      {
        label: '旋盖',
        value: '旋盖'
      }
    ],
    L10: [
      {
        label: '纸袋',
        value: '纸袋'
      }
    ],
    L11: [
      {
        label: '旋盖',
        value: '旋盖'
      }
    ],
    L12: [
      {
        label: '旋盖',
        value: '旋盖'
      }
    ],
    L13: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L14: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L15: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L16: [
      {
        label: '麦秸秆',
        value: '麦秸秆'
      }
    ],
    L17: [
      {
        label: '麦秸秆',
        value: '麦秸秆'
      }
    ],
    L18: [
      {
        label: '麦秸秆',
        value: '麦秸秆'
      }
    ],
    L19: [
      {
        label: '麦秸秆',
        value: '麦秸秆'
      }
    ],
    L20: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L21: [
      {
        label: '竹木',
        value: '竹木'
      }
    ],
    L22: [
      {
        label: '麦秸秆',
        value: '麦秸秆'
      }
    ],
    L23: [
      {
        label: '麦秸秆',
        value: '麦秸秆'
      }
    ],
    L24: [
      {
        label: '旋盖',
        value: '旋盖'
      }
    ],
    L25: [
      {
        label: '纸袋',
        value: '纸袋'
      }
    ],
    L26: [
      {
        label: '旋盖',
        value: '旋盖'
      }
    ],
    L27: [
      {
        label: '降解塑料',
        value: '降解塑料'
      }
    ],
    L28: [
      {
        label: '降解塑料',
        value: '降解塑料'
      }
    ],
    L29: [
      {
        label: '降解塑料',
        value: '降解塑料'
      }
    ],
    L30: [
      {
        label: '瓦楞',
        value: '瓦楞'
      }
    ],
    L31: [
      {
        label: '纸盒',
        value: '纸盒'
      }
    ],
    L32: [
      {
        label: '纸盒',
        value: '纸盒'
      }
    ],
    L33: [
      {
        label: '纸盒',
        value: '纸盒'
      }
    ]
  },
  thickness: {
    L1: [
      {
        label: '5.25',
        value: '5.25'
      }
    ],
    L2: [
      {
        label: '9',
        value: '9'
      }
    ],
    L3: [
      {
        label: '5.5',
        value: '5.5'
      }
    ],
    L4: [
      {
        label: '5.25',
        value: '5.25'
      }
    ],
    L5: [
      {
        label: '5',
        value: '5'
      }
    ],
    L6: [
      {
        label: '8.5',
        value: '8.5'
      }
    ],
    L7: [
      {
        label: '8',
        value: '8'
      }
    ],
    L8: [
      {
        label: '/',
        value: '/'
      }
    ],
    L9: [
      {
        label: '/',
        value: '/'
      }
    ],
    L10: [
      {
        label: '/',
        value: '/'
      }
    ],
    L11: [
      {
        label: '/',
        value: '/'
      }
    ],
    L12: [
      {
        label: '/',
        value: '/'
      }
    ],
    L13: [
      {
        label: '6',
        value: '6'
      }
    ],
    L14: [
      {
        label: '6',
        value: '6'
      }
    ],
    L15: [
      {
        label: '/',
        value: '/'
      }
    ],
    L16: [
      {
        label: '6',
        value: '6'
      }
    ],
    L17: [
      {
        label: '5',
        value: '5'
      }
    ],
    L18: [
      {
        label: '17',
        value: '17'
      }
    ],
    L19: [
      {
        label: '4',
        value: '4'
      }
    ],
    L20: [
      {
        label: '17',
        value: '17'
      }
    ],
    L21: [
      {
        label: '15',
        value: '15'
      }
    ],
    L22: [
      {
        label: '20',
        value: '20'
      }
    ],
    L23: [
      {
        label: '20',
        value: '20'
      }
    ],
    L24: [
      {
        label: '/',
        value: '/'
      }
    ],
    L25: [
      {
        label: '/',
        value: '/'
      }
    ],
    L26: [
      {
        label: '/',
        value: '/'
      }
    ],
    L27: [
      {
        label: '0.05',
        value: '0.05'
      }
    ],
    L28: [
      {
        label: '0.05',
        value: '0.05'
      }
    ],
    L29: [
      {
        label: '0.05',
        value: '0.05'
      }
    ],
    L30: [
      {
        label: '210',
        value: '210'
      }
    ],
    L31: [
      {
        label: '160',
        value: '160'
      }
    ],
    L32: [
      {
        label: '250',
        value: '250'
      }
    ],
    L33: [
      {
        label: '110',
        value: '110'
      }
    ]
  },
  length: {
    L1: [
      {
        label: '190',
        value: '190'
      }
    ],
    L2: [
      {
        label: '140',
        value: '140'
      }
    ],
    L3: [
      {
        label: '183',
        value: '183'
      }
    ],
    L4: [
      {
        label: '142',
        value: '142'
      }
    ],
    L5: [
      {
        label: '145',
        value: '145'
      }
    ],
    L6: [
      {
        label: '180',
        value: '180'
      }
    ],
    L7: [
      {
        label: '165',
        value: '165'
      }
    ],
    L8: [
      {
        label: '/',
        value: '/'
      }
    ],
    L9: [
      {
        label: '/',
        value: '/'
      }
    ],
    L10: [
      {
        label: '/',
        value: '/'
      }
    ],
    L11: [
      {
        label: '/',
        value: '/'
      }
    ],
    L12: [
      {
        label: '/',
        value: '/'
      }
    ],
    L13: [
      {
        label: '135',
        value: '135'
      }
    ],
    L14: [
      {
        label: '140',
        value: '140'
      }
    ],
    L15: [
      {
        label: '155',
        value: '155'
      }
    ],
    L16: [
      {
        label: '128',
        value: '128'
      }
    ],
    L17: [
      {
        label: '185',
        value: '185'
      }
    ],
    L18: [
      {
        label: '98',
        value: '98'
      }
    ],
    L19: [
      {
        label: '155',
        value: '155'
      }
    ],
    L20: [
      {
        label: '132',
        value: '132'
      }
    ],
    L21: [
      {
        label: '130',
        value: '130'
      }
    ],
    L22: [
      {
        label: '100',
        value: '100'
      }
    ],
    L23: [
      {
        label: '119',
        value: '119'
      }
    ],
    L24: [
      {
        label: '/',
        value: '/'
      }
    ],
    L25: [
      {
        label: '/',
        value: '/'
      }
    ],
    L26: [
      {
        label: '/',
        value: '/'
      }
    ],
    L27: [
      {
        label: '200',
        value: '200'
      }
    ],
    L28: [
      {
        label: '150',
        value: '150'
      }
    ],
    L29: [
      {
        label: '150',
        value: '150'
      }
    ],
    L30: [
      {
        label: '470',
        value: '470'
      }
    ],
    L31: [
      {
        label: '195',
        value: '195'
      }
    ],
    L32: [
      {
        label: '136',
        value: '136'
      }
    ],
    L33: [
      {
        label: '156',
        value: '156'
      }
    ]
  },
  widths: {
    L1: [
      {
        label: '15',
        value: '15'
      }
    ],
    L2: [
      {
        label: '15',
        value: '15'
      }
    ],
    L3: [
      {
        label: '11',
        value: '11'
      }
    ],
    L4: [
      {
        label: '8',
        value: '8'
      }
    ],
    L5: [
      {
        label: '12',
        value: '12'
      }
    ],
    L6: [
      {
        label: '10.5',
        value: '10.5'
      }
    ],
    L7: [
      {
        label: '11',
        value: '11'
      }
    ],
    L8: [
      {
        label: '/',
        value: '/'
      }
    ],
    L9: [
      {
        label: '/',
        value: '/'
      }
    ],
    L10: [
      {
        label: '/',
        value: '/'
      }
    ],
    L11: [
      {
        label: '/',
        value: '/'
      }
    ],
    L12: [
      {
        label: '/',
        value: '/'
      }
    ],
    L13: [
      {
        label: '30',
        value: '30'
      }
    ],
    L14: [
      {
        label: '30',
        value: '30'
      }
    ],
    L15: [
      {
        label: '47',
        value: '47'
      }
    ],
    L16: [
      {
        label: '35',
        value: '35'
      }
    ],
    L17: [
      {
        label: '27',
        value: '27'
      }
    ],
    L18: [
      {
        label: '28',
        value: '28'
      }
    ],
    L19: [
      {
        label: '32',
        value: '32'
      }
    ],
    L20: [
      {
        label: '17',
        value: '17'
      }
    ],
    L21: [
      {
        label: '15',
        value: '15'
      }
    ],
    L22: [
      {
        label: '40',
        value: '40'
      }
    ],
    L23: [
      {
        label: '40',
        value: '40'
      }
    ],
    L24: [
      {
        label: '/',
        value: '/'
      }
    ],
    L25: [
      {
        label: '/',
        value: '/'
      }
    ],
    L26: [
      {
        label: '/',
        value: '/'
      }
    ],
    L27: [
      {
        label: '44',
        value: '44'
      }
    ],
    L28: [
      {
        label: '40',
        value: '40'
      }
    ],
    L29: [
      {
        label: '70',
        value: '70'
      }
    ],
    L30: [
      {
        label: '300',
        value: '300'
      }
    ],
    L31: [
      {
        label: '310',
        value: '310'
      }
    ],
    L32: [
      {
        label: '510',
        value: '510'
      }
    ],
    L33: [
      {
        label: '420',
        value: '420'
      }
    ]
  },
  weights: {
    L1: [
      {
        label: '6',
        value: '6'
      }
    ],
    L2: [
      {
        label: '6.5',
        value: '6.5'
      }
    ],
    L3: [
      {
        label: '6.5',
        value: '6.5'
      }
    ],
    L4: [
      {
        label: '4',
        value: '4'
      }
    ],
    L5: [
      {
        label: '5.5',
        value: '5.5'
      }
    ],
    L6: [
      {
        label: '9.5',
        value: '9.5'
      }
    ],
    L7: [
      {
        label: '8.5',
        value: '8.5'
      }
    ],
    L8: [
      {
        label: '6',
        value: '6'
      }
    ],
    L9: [
      {
        label: '7',
        value: '7'
      }
    ],
    L10: [
      {
        label: '4',
        value: '4'
      }
    ],
    L11: [
      {
        label: '6',
        value: '6'
      }
    ],
    L12: [
      {
        label: '7',
        value: '7'
      }
    ],
    L13: [
      {
        label: '9.5',
        value: '9.5'
      }
    ],
    L14: [
      {
        label: '12.5',
        value: '12.5'
      }
    ],
    L15: [
      {
        label: '34.5',
        value: '34.5'
      }
    ],
    L16: [
      {
        label: '10.5',
        value: '10.5'
      }
    ],
    L17: [
      {
        label: '8',
        value: '8'
      }
    ],
    L18: [
      {
        label: '17',
        value: '17'
      }
    ],
    L19: [
      {
        label: '4',
        value: '4'
      }
    ],
    L20: [
      {
        label: '10.5',
        value: '10.5'
      }
    ],
    L21: [
      {
        label: '15.5',
        value: '15.5'
      }
    ],
    L22: [
      {
        label: '5',
        value: '5'
      }
    ],
    L23: [
      {
        label: '5.5',
        value: '5.5'
      }
    ],
    L24: [
      {
        label: '11',
        value: '11'
      }
    ],
    L25: [
      {
        label: '11',
        value: '11'
      }
    ],
    L26: [
      {
        label: '11',
        value: '11'
      }
    ],
    L27: [
      {
        label: '/',
        value: '/'
      }
    ],
    L28: [
      {
        label: '/',
        value: '/'
      }
    ],
    L29: [
      {
        label: '/',
        value: '/'
      }
    ],
    L30: [
      {
        label: '/',
        value: '/'
      }
    ],
    L31: [
      {
        label: '/',
        value: '/'
      }
    ],
    L32: [
      {
        label: '/',
        value: '/'
      }
    ],
    L33: [
      {
        label: '/',
        value: '/'
      }
    ]
  },
  crafts: {
    L1: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L2: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L3: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L4: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L5: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L6: [
      {
        label: '注塑',
        value: '注塑'
      }
    ],
    L7: [
      {
        label: '注塑',
        value: '注塑'
      }
    ],
    L8: [
      {
        label: '/',
        value: '/'
      }
    ],
    L9: [
      {
        label: '/',
        value: '/'
      }
    ],
    L10: [
      {
        label: '/',
        value: '/'
      }
    ],
    L11: [
      {
        label: '/',
        value: '/'
      }
    ],
    L12: [
      {
        label: '/',
        value: '/'
      }
    ],
    L13: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L14: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L15: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L16: [
      {
        label: '注塑',
        value: '注塑'
      }
    ],
    L17: [
      {
        label: '注塑',
        value: '注塑'
      }
    ],
    L18: [
      {
        label: '注塑',
        value: '注塑'
      }
    ],
    L19: [
      {
        label: '注塑',
        value: '注塑'
      }
    ],
    L20: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L21: [
      {
        label: '雕刻',
        value: '雕刻'
      }
    ],
    L22: [
      {
        label: '注塑',
        value: '注塑'
      }
    ],
    L23: [
      {
        label: '注塑',
        value: '注塑'
      }
    ],
    L24: [
      {
        label: '/',
        value: '/'
      }
    ],
    L25: [
      {
        label: '/',
        value: '/'
      }
    ],
    L26: [
      {
        label: '/',
        value: '/'
      }
    ],
    L27: [
      {
        label: '挤压成型',
        value: '挤压成型'
      }
    ],
    L28: [
      {
        label: '挤压成型',
        value: '挤压成型'
      }
    ],
    L29: [
      {
        label: '挤压成型',
        value: '挤压成型'
      }
    ],
    L30: [
      {
        label: '粘合',
        value: '粘合'
      }
    ],
    L31: [
      {
        label: '印刷',
        value: '印刷'
      }
    ],
    L32: [
      {
        label: '印刷',
        value: '印刷'
      }
    ],
    L33: [
      {
        label: '印刷',
        value: '印刷'
      }
    ]
  }
}

// 定义品类标签映射
const CATEGORY_LABEL_MAP: Record<CategoryType, string> = {
  room_card: '房卡',
  slipper: '拖鞋',
  pen: '环保笔',
  badge_lanyard: '胸牌',
  umbrella: '雨伞',
  six_small_items: '六小件'
}

const InquiryPage: FC = () => {
  const { styles } = useStyle()
  const [displayedMarkdown, setDisplayedMarkdown] = useState<string>('')
  const [isTyping, setIsTyping] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>()
  const [items, setItems] = useState<CategoryItem[]>([])
  const [activeKey, setActiveKey] = useState<string | string[]>([])
  // 添加拖鞋材质状态
  const [selectedTexture, setSelectedTexture] = useState<string>()
  // const [
  // selectedUmbrellaName,
  // setSelectedUmbrellaName
  // ] = useState<string>()
  const [fullMarkdown, setFullMarkdown] = useState<string[]>([])
  const markdownContainerRef = useRef<HTMLDivElement>(null)

  const onChange = (key: string | string[]) => {
    setActiveKey(key)
  }

  const genExtra = (item: CategoryItem) => (
    <DeleteOutlined
      onClick={(event) => {
        event.stopPropagation()
        handleDelete(item.key)
      }}
    />
  )

  const handleDelete = (key: string) => {
    console.log(key)
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个询价品类吗？',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        setItems(items.filter((item) => item.key !== key))

        // 从 activeKey 中移除被删除的 key
        setActiveKey(Array.isArray(activeKey) ? activeKey.filter((k) => k !== key) : activeKey === key ? [] : activeKey)

        // 清理对应的 md 数据
        setFullMarkdown(fullMarkdown.filter((_, index) => index !== items.findIndex((item) => item.key === key)))

        message.success('删除成功')
      }
    })
  }

  const handleAddCategory = () => {
    setIsModalOpen(true)
    setSelectedCategory(undefined)
    form.resetFields()
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSelectedCategory(undefined)
    form.resetFields()
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      console.log('表单值:', values)

      const newKey = Date.now().toString()
      const newItem: CategoryItem = {
        key: newKey,
        label: CATEGORY_LABEL_MAP[values.category] || '',
        category: values.category,
        material: values.material,
        thickness: values.thickness,
        length: values.length,
        width: values.width,
        process: values.process,
        chip: values.chip,
        encrypted: values.encrypted,
        texture: values.texture,
        size: values.size,
        craft: values.craft,
        packaging: values.packaging,
        name: values.name,
        boneNum: values.boneNum,
        handShank: values.handShank,
        selectedUmbrellaName: values.name, // 保存雨伞名称
        weight: values.weight, // 添加克重字段
        children: renderDetailForm({
          key: newKey,
          label: values.category,
          category: values.category,
          material: values.material,
          thickness: values.thickness,
          length: values.length,
          width: values.width,
          process: values.process,
          chip: values.chip,
          encrypted: values.encrypted,
          texture: values.texture,
          size: values.size,
          craft: values.craft,
          packaging: values.packaging,
          name: values.name,
          boneNum: values.boneNum,
          handShank: values.handShank,
          selectedUmbrellaName: values.name, // 保存雨伞名称
          weight: values.weight, // 添加克重字段
          children: null,
          extra: null
        }),
        extra: null
      }

      setItems([...items, { ...newItem, extra: genExtra(newItem) }])
      setActiveKey(newKey)
      setIsModalOpen(false)
      setSelectedCategory(undefined)
      form.resetFields()
      message.success('添加成功')
    } catch (error) {
      console.error('表单验证失败:', error)
      message.error('添加失败')
    }
  }

  const handleCategoryChange = (value: CategoryType) => {
    setSelectedCategory(value)
    form.resetFields([
      'material',
      'thickness',
      'length',
      'width',
      'process',
      'chip',
      'encrypted',
      'texture',
      'size',
      'craft',
      'packaging',
      'name'
    ])
    handlePrintProdTypeParams(value)
  }

  const handleTextureChange = (value: string) => {
    setSelectedTexture(value)
    // 重置尺码和工艺选择
    form.setFieldsValue({
      size: undefined,
      craft: undefined
    })
  }

  const getCurrentSizeOptions = () => {
    if (!selectedTexture) return []
    const textureKey = SLIPPER_DATA.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? SLIPPER_DATA.sizes[textureKey as keyof typeof SLIPPER_DATA.sizes] : []
  }

  const getCurrentCraftOptions = () => {
    if (!selectedTexture) return []
    const textureKey = SLIPPER_DATA.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? SLIPPER_DATA.crafts[textureKey as keyof typeof SLIPPER_DATA.crafts] : []
  }

  const getCategoryFormItems = () => {
    const categoryItem = (
      <Form.Item name="category" label="品类" rules={[{ required: true, message: '请选择品类' }]}>
        <CategoryRadioGroup onChange={(e) => handleCategoryChange(e.target.value as CategoryType)}>
          {CATEGORY_OPTIONS.map((option) => (
            <Radio.Button key={option.value} value={option.value}>
              {option.label}
            </Radio.Button>
          ))}
        </CategoryRadioGroup>
      </Form.Item>
    )

    if (!selectedCategory) return [categoryItem]

    switch (selectedCategory) {
      case 'room_card':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item
            key="thickness"
            label="厚度mm"
            name="thickness"
            rules={[{ required: true, message: '请选择厚度' }]}>
            <Radio.Group>
              <Radio value="1.85">1.85</Radio>
              <Radio value="2.0">2.0</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="length" label="长mm" name="length" rules={[{ required: true, message: '请输入长度' }]}>
            <InputNumber min={1} />
          </Form.Item>,
          <Form.Item key="width" label="宽mm" name="width" rules={[{ required: true, message: '请输入宽度' }]}>
            <InputNumber min={1} />
          </Form.Item>,
          <Form.Item
            key="process"
            label="产品工艺"
            name="process"
            rules={[{ required: true, message: '请选择产品工艺' }]}>
            <Checkbox.Group
              options={[
                { label: '印刷', value: '印刷' },
                { label: '烫金', value: '烫金' },
                { label: 'UV', value: 'UV' }
              ]}
            />
          </Form.Item>,
          <Form.Item key="chip" label="芯片" name="chip" rules={[{ required: true, message: '请选择芯片' }]}>
            <Select>
              <Select.Option value="CP.1.01.0372">CP.1.01.0372</Select.Option>
              <Select.Option value="CP.1.01.0373">CP.1.01.0373</Select.Option>
            </Select>
          </Form.Item>,
          <Form.Item
            key="encrypted"
            label="是否加密"
            name="encrypted"
            rules={[{ required: true, message: '请选择是否加密' }]}>
            <Select>
              <Select.Option value="1">是</Select.Option>
              <Select.Option value="0">否</Select.Option>
            </Select>
          </Form.Item>
        ]
      case 'slipper':
        return [
          categoryItem,
          <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group onChange={(e) => handleTextureChange(e.target.value)}>
              {SLIPPER_DATA.textures.map((option) => (
                <Radio key={option.key} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="size" label="长*宽mm" name="size" rules={[{ required: true, message: '请选择尺码' }]}>
            <Select>
              {getCurrentSizeOptions().map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
            <Select>
              {getCurrentCraftOptions().map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item key="packaging" label="包装" name="packaging" rules={[{ required: true, message: '请选择包装' }]}>
            <Radio.Group>
              {SLIPPER_DATA.packaging.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        ]
      case 'pen':
        return [
          categoryItem,
          <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline" onChange={(e) => handlePenTextureChange(e.target.value)}>
              {PEN_DATA.textures.map((texture) => (
                <Radio key={texture.key} value={texture.value}>
                  {texture.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="size" label="长*宽mm" name="size" rules={[{ required: true, message: '请选择长宽' }]}>
            <Select>
              {getCurrentPenSizeOptions().map((size) => (
                <Select.Option key={size.value} value={size.value}>
                  {size.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择产品工艺' }]}>
            <Select>
              {getCurrentPenCraftOptions().map((craft) => (
                <Select.Option key={craft.value} value={craft.value}>
                  {craft.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ]
      case 'badge_lanyard':
        return [
          categoryItem,
          <Form.Item key="name" label="产品名称" name="name" rules={[{ required: true, message: '请选择名称' }]}>
            <Select
              placeholder="请选择名称"
              showSearch
              optionFilterProp="label"
              onChange={handleBadgeLanyardNameChange}>
              {BADEG_LANYARD_DATA.names.map((option) => (
                <Select.Option key={option.key} value={option.key} label={option.label}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item key="size" label="尺寸" name="size" rules={[{ required: true, message: '请选择尺寸' }]}>
            <Input disabled placeholder="请选择名称后自动显示" />
          </Form.Item>,
          <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
            <Input disabled placeholder="请选择名称后自动显示" />
          </Form.Item>
        ]
      case 'umbrella':
        return [
          categoryItem,
          <Form.Item key="name" label="产品名称" name="name" rules={[{ required: true, message: '请选择产品名称' }]}>
            <Select onChange={handleUmbrellaNameChange} placeholder="请选择产品">
              {UMBRELLA_DATA.names.map((item) => (
                <Select.Option key={item.key} value={item.key}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item key="texture" label="伞珠材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
            <Input disabled placeholder="请选择产品名称后自动显示" />
          </Form.Item>,
          <Form.Item key="size" label="雨伞尺寸" name="size" rules={[{ required: true, message: '请选择雨伞尺寸' }]}>
            <Select disabled placeholder="请选择产品名称后自动显示">
              {getCurrentUmbrellaSizeOptions().map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item
            key="boneNum"
            label="雨伞骨数"
            name="boneNum"
            rules={[{ required: true, message: '请选择雨伞骨数' }]}>
            <Select disabled placeholder="请选择产品名称后自动显示">
              {getCurrentBoneNumOptions().map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item
            key="handShank"
            label="雨伞手柄"
            name="handShank"
            rules={[{ required: true, message: '请选择雨伞手柄' }]}>
            <Select disabled placeholder="请选择产品名称后自动显示">
              {getCurrentHandShankOptions().map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
            <Select disabled placeholder="请选择产品名称后自动显示">
              {getCurrentUmbrellaCraftOptions().map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ]
      case 'six_small_items':
        return [
          categoryItem,
          <Form.Item key="name" label="产品名称" name="name" rules={[{ required: true, message: '请选择产品名称' }]}>
            <Select onChange={handleSixSmallItemsNameChange} placeholder="请选择产品">
              {SIX_SMALL_ITEMS_DATA.names.map((item) => (
                <Select.Option key={item.key} value={item.key}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
            <Input disabled placeholder="请选择产品名称后自动显示" />
          </Form.Item>,
          <Form.Item
            key="thickness"
            label="厚度mm"
            name="thickness"
            rules={[{ required: true, message: '请选择厚度' }]}>
            <Input disabled placeholder="请选择产品名称后自动显示" />
          </Form.Item>,
          <Form.Item key="length" label="长度mm" name="length" rules={[{ required: true, message: '请输入长度' }]}>
            <Input disabled placeholder="请选择产品名称后自动显示" />
          </Form.Item>,
          <Form.Item key="width" label="宽度mm" name="width" rules={[{ required: true, message: '请输入宽度' }]}>
            <Input disabled placeholder="请选择产品名称后自动显示" />
          </Form.Item>,
          <Form.Item key="weight" label="克重g" name="weight" rules={[{ required: true, message: '请输入克重' }]}>
            <Input disabled placeholder="请选择产品名称后自动显示" />
          </Form.Item>,
          <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
            <Input disabled placeholder="请选择产品名称后自动显示" />
          </Form.Item>
        ]
      default:
        return [categoryItem]
    }
  }

  const DetailFormComponent: FC<{ item: CategoryItem; form: FormInstance }> = ({ item, form }) => {
    const { styles } = useStyles()

    return (
      <div className={styles.detailContainer}>
        <Form
          disabled
          form={form}
          layout="vertical"
          className={styles.detailForm}
          initialValues={item}
          onValuesChange={handleFormValuesChange}>
          {item.category === 'room_card' && (
            <>
              <Form.Item
                key="material"
                label="材质"
                name="material"
                rules={[{ required: true, message: '请选择材质' }]}>
                <Radio.Group buttonStyle="outline">
                  <Radio value="纸质">纸质</Radio>
                  <Radio value="塑料">塑料</Radio>
                  <Radio value="金属">金属</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                key="thickness"
                label="厚度mm"
                name="thickness"
                rules={[{ required: true, message: '请选择厚度' }]}>
                <Radio.Group>
                  <Radio value="1.85">1.85</Radio>
                  <Radio value="2.0">2.0</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item key="length" label="长mm" name="length" rules={[{ required: true, message: '请输入长度' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item key="width" label="宽mm" name="width" rules={[{ required: true, message: '请输入宽度' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item
                key="process"
                label="产品工艺"
                name="process"
                rules={[{ required: true, message: '请选择产品工艺' }]}>
                <Checkbox.Group
                  options={[
                    { label: '印刷', value: '印刷' },
                    { label: '烫金', value: '烫金' },
                    { label: 'UV', value: 'UV' }
                  ]}
                />
              </Form.Item>
              <Form.Item key="chip" label="芯片" name="chip" rules={[{ required: true, message: '请选择芯片' }]}>
                <Select>
                  <Select.Option value="CP.1.01.0372">CP.1.01.0372</Select.Option>
                  <Select.Option value="CP.1.01.0373">CP.1.01.0373</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                key="encrypted"
                label="是否加密"
                name="encrypted"
                rules={[{ required: true, message: '请选择是否加密' }]}>
                <Select>
                  <Select.Option value="1">是</Select.Option>
                  <Select.Option value="0">否</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {item.category === 'slipper' && (
            <>
              <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
                <Radio.Group onChange={(e) => handleTextureChange(e.target.value)}>
                  {SLIPPER_DATA.textures.map((option) => (
                    <Radio key={option.key} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item key="size" label="长*宽mm" name="size" rules={[{ required: true, message: '请选择尺码' }]}>
                <Select>
                  {getCurrentSizeOptions().map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
                <Select>
                  {getCurrentCraftOptions().map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="packaging"
                label="包装"
                name="packaging"
                rules={[{ required: true, message: '请选择包装' }]}>
                <Radio.Group>
                  {SLIPPER_DATA.packaging.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </>
          )}

          {item.category === 'badge_lanyard' && (
            <>
              <Form.Item key="name" label="产品名称" name="name" rules={[{ required: true, message: '请选择名称' }]}>
                <Select
                  placeholder="请选择名称"
                  showSearch
                  optionFilterProp="label"
                  onChange={handleBadgeLanyardNameChange}>
                  {BADEG_LANYARD_DATA.names.map((option) => (
                    <Select.Option key={option.key} value={option.key} label={option.label}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item key="size" label="尺寸" name="size" rules={[{ required: true, message: '请选择尺寸' }]}>
                <Input disabled placeholder="请选择名称后自动显示" />
              </Form.Item>
              <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
                <Input disabled placeholder="请选择名称后自动显示" />
              </Form.Item>
            </>
          )}

          {item.category === 'pen' && (
            <>
              <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
                <Radio.Group buttonStyle="outline" onChange={(e) => handlePenTextureChange(e.target.value)}>
                  {PEN_DATA.textures.map((texture) => (
                    <Radio key={texture.key} value={texture.value}>
                      {texture.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item key="size" label="长*宽mm" name="size" rules={[{ required: true, message: '请选择长宽' }]}>
                <Select>
                  {getCurrentPenSizeOptions().map((size) => (
                    <Select.Option key={size.value} value={size.value}>
                      {size.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="craft"
                label="产品工艺"
                name="craft"
                rules={[{ required: true, message: '请选择产品工艺' }]}>
                <Select>
                  {getCurrentPenCraftOptions().map((craft) => (
                    <Select.Option key={craft.value} value={craft.value}>
                      {craft.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {item.category === 'umbrella' && (
            <>
              <Form.Item
                key="name"
                label="产品名称"
                name="name"
                rules={[{ required: true, message: '请选择产品名称' }]}>
                <Select onChange={handleUmbrellaNameChange} placeholder="请选择产品">
                  {UMBRELLA_DATA.names.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="texture"
                label="伞珠材质"
                name="texture"
                rules={[{ required: true, message: '请选择材质' }]}>
                <Input disabled placeholder="请选择产品名称后自动显示" />
              </Form.Item>
              <Form.Item
                key="size"
                label="雨伞尺寸"
                name="size"
                rules={[{ required: true, message: '请选择雨伞尺寸' }]}>
                <Select disabled placeholder="请选择产品名称后自动显示">
                  {getCurrentUmbrellaSizeOptions().map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="boneNum"
                label="雨伞骨数"
                name="boneNum"
                rules={[{ required: true, message: '请选择雨伞骨数' }]}>
                <Select disabled placeholder="请选择产品名称后自动显示">
                  {getCurrentBoneNumOptions().map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="handShank"
                label="雨伞手柄"
                name="handShank"
                rules={[{ required: true, message: '请选择雨伞手柄' }]}>
                <Select disabled placeholder="请选择产品名称后自动显示">
                  {getCurrentHandShankOptions().map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
                <Select disabled placeholder="请选择产品名称后自动显示">
                  {getCurrentUmbrellaCraftOptions().map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {item.category === 'six_small_items' && (
            <>
              <Form.Item
                key="name"
                label="产品名称"
                name="name"
                rules={[{ required: true, message: '请选择产品名称' }]}>
                <Select onChange={handleSixSmallItemsNameChange} placeholder="请选择产品">
                  {SIX_SMALL_ITEMS_DATA.names.map((item) => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
                <Input disabled placeholder="请选择产品名称后自动显示" />
              </Form.Item>
              <Form.Item
                key="thickness"
                label="厚度mm"
                name="thickness"
                rules={[{ required: true, message: '请选择厚度' }]}>
                <Input disabled placeholder="请选择产品名称后自动显示" />
              </Form.Item>
              <Form.Item key="length" label="长度mm" name="length" rules={[{ required: true, message: '请输入长度' }]}>
                <Input disabled placeholder="请选择产品名称后自动显示" />
              </Form.Item>
              <Form.Item key="width" label="宽度mm" name="width" rules={[{ required: true, message: '请输入宽度' }]}>
                <Input disabled placeholder="请选择产品名称后自动显示" />
              </Form.Item>
              <Form.Item key="weight" label="克重g" name="weight" rules={[{ required: true, message: '请输入克重' }]}>
                <Input disabled placeholder="请选择产品名称后自动显示" />
              </Form.Item>
              <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
                <Input disabled placeholder="请选择产品名称后自动显示" />
              </Form.Item>
            </>
          )}
        </Form>
      </div>
    )
  }

  const renderDetailForm = (item: CategoryItem) => <DetailFormComponent item={item} form={form} />

  useEffect(() => {
    const duration = 3000 // 总持续时间改为3秒
    const interval = 30 // 更新间隔
    const steps = duration / interval
    const increment = 100 / steps

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsLoading(false)
          return 100
        }
        return prev + increment
      })
    }, interval)

    // 3秒后强制关闭遮罩层
    const closeTimer = setTimeout(() => {
      setIsLoading(false)
      setProgress(100)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(closeTimer)
    }
  }, [])

  // 使用 useCallback 和 debounce 优化滚动函数
  const scrollToBottom = useCallback(
    debounce(() => {
      if (markdownContainerRef.current) {
        const container = markdownContainerRef.current
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        })
      }
    }, 50),
    []
  )

  useEffect(() => {
    let currentText = ''
    let currentIndex = 0
    let currentArrayIndex = 0
    const interval = 30 // 更快的打字速度
    setIsTyping(true)

    const timer = setInterval(() => {
      if (currentArrayIndex < fullMarkdown.length) {
        const currentMarkdown = fullMarkdown[currentArrayIndex]
        if (currentIndex < currentMarkdown.length) {
          currentText += currentMarkdown[currentIndex]
          currentIndex++
        } else {
          currentText += '\n\n'
          currentArrayIndex++
          currentIndex = 0
        }
        setDisplayedMarkdown(currentText)
        scrollToBottom()
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, interval)

    return () => {
      clearInterval(timer)
      scrollToBottom.cancel()
    }
  }, [fullMarkdown, scrollToBottom])

  useEffect(() => {
    console.log('fullMarkdown 已更新:', fullMarkdown)
    // 实时更新 displayedMarkdown
    setDisplayedMarkdown(fullMarkdown.join('\n\n'))
  }, [fullMarkdown])

  const handlePrintProdTypeParams = async (category: CategoryType) => {
    try {
      const res = await queryProdTypeParams(category)
      console.log(`【queryProdTypeParams返回内容 - ${category}】`, res)

      // 检查返回结果
      if (!res || res.code !== 200) {
        message.error(`获取${category}品类参数失败: ${res?.message || '未知错误'}`)
        return
      }

      // 检查数据是否存在
      if (!res.data) {
        message.warning(`未找到${category}品类参数数据`)
        return
      }

      // 拿到对应品类的参数赋予到相关常量数据
      switch (category) {
        case 'room_card':
          Object.assign(ROOM_CARD_DATA, res.data)
          console.log('ROOM_CARD_DATA', ROOM_CARD_DATA)
          break
        case 'slipper':
          console.log(res.data)
          SLIPPER_DATA.packaging = res.data?.packagings
          Object.assign(SLIPPER_DATA, res.data)
          console.log('SLIPPER_DATA', SLIPPER_DATA)
          break
        case 'pen':
          Object.assign(PEN_DATA, res.data)
          console.log('PEN_DATA', PEN_DATA)
          break
        case 'badge_lanyard':
          Object.assign(BADEG_LANYARD_DATA, res.data)
          console.log('BADEG_LANYARD_DATA', BADEG_LANYARD_DATA)
          break
        case 'umbrella':
          Object.assign(UMBRELLA_DATA, res.data)
          console.log('UMBRELLA_DATA', UMBRELLA_DATA)
          break
        case 'six_small_items':
          Object.assign(SIX_SMALL_ITEMS_DATA, res.data)
          console.log('SIX_SMALL_ITEMS_DATA', SIX_SMALL_ITEMS_DATA)
          break
      }
    } catch (e) {
      console.error(`【queryProdTypeParams接口调用失败 - ${category}】`, e)
    }
  }

  const handlePenTextureChange = (value: string) => {
    setSelectedTexture(value)
    // 重置尺码和工艺选择
    form.setFieldsValue({
      size: undefined,
      craft: undefined
    })
  }

  const getCurrentPenSizeOptions = () => {
    if (!selectedTexture) return []
    const textureKey = PEN_DATA.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? PEN_DATA.sizes[textureKey as keyof typeof PEN_DATA.sizes] : []
  }

  const getCurrentPenCraftOptions = () => {
    if (!selectedTexture) return []
    const textureKey = PEN_DATA.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? PEN_DATA.crafts[textureKey as keyof typeof PEN_DATA.crafts] : []
  }

  const handleBadgeLanyardNameChange = (value: string) => {
    // 获取选中项的 label
    const selectedItem = BADEG_LANYARD_DATA.names.find((item) => item.key === value)
    console.log('value:', value)
    console.log('label:', selectedItem?.label)

    // 获取选中胸牌的所有参数
    const sizeOptions = BADEG_LANYARD_DATA.sizes[value as keyof typeof BADEG_LANYARD_DATA.sizes] || []
    const craftOptions = BADEG_LANYARD_DATA.crafts[value as keyof typeof BADEG_LANYARD_DATA.crafts] || []

    // 自动填充联动字段
    form.setFieldsValue({
      name: selectedItem?.label, // 设置 name 字段为 label 值
      size: sizeOptions[0]?.value,
      craft: craftOptions[0]?.value
    })
  }

  const handleUmbrellaNameChange = (value: string) => {
    // 获取选中项的 label
    const selectedItem = UMBRELLA_DATA.names.find((item) => item.key === value)
    console.log('value:', value)
    console.log('label:', selectedItem?.label)

    // 获取选中雨伞的所有参数
    const boneNumOptions = UMBRELLA_DATA.boneNums[value as keyof typeof UMBRELLA_DATA.boneNums] || []
    const handShankOptions = UMBRELLA_DATA.handShanks[value as keyof typeof UMBRELLA_DATA.handShanks] || []
    const sizeOptions = UMBRELLA_DATA.sizes[value as keyof typeof UMBRELLA_DATA.sizes] || []
    const craftOptions = UMBRELLA_DATA.crafts[value as keyof typeof UMBRELLA_DATA.crafts] || []
    const textureOptions = UMBRELLA_DATA.textures[value as keyof typeof UMBRELLA_DATA.textures] || []

    // 自动填充联动字段
    form.setFieldsValue({
      name: selectedItem?.label, // 设置 name 字段为 label 值
      boneNum: boneNumOptions[0]?.value,
      handShank: handShankOptions[0]?.value,
      size: sizeOptions[0]?.value,
      craft: craftOptions[0]?.value,
      texture: textureOptions[0]?.value
    })
  }

  const getCurrentBoneNumOptions = () => {
    const currentItem = items.find((item) => item.key === activeKey)
    if (!currentItem?.selectedUmbrellaName) return []
    return UMBRELLA_DATA.boneNums[currentItem.selectedUmbrellaName as keyof typeof UMBRELLA_DATA.boneNums] || []
  }

  const getCurrentHandShankOptions = () => {
    const currentItem = items.find((item) => item.key === activeKey)
    if (!currentItem?.selectedUmbrellaName) return []
    return UMBRELLA_DATA.handShanks[currentItem.selectedUmbrellaName as keyof typeof UMBRELLA_DATA.handShanks] || []
  }

  const getCurrentUmbrellaSizeOptions = () => {
    const currentItem = items.find((item) => item.key === activeKey)
    if (!currentItem?.selectedUmbrellaName) return []
    return UMBRELLA_DATA.sizes[currentItem.selectedUmbrellaName as keyof typeof UMBRELLA_DATA.sizes] || []
  }

  const getCurrentUmbrellaCraftOptions = () => {
    const currentItem = items.find((item) => item.key === activeKey)
    if (!currentItem?.selectedUmbrellaName) return []
    return UMBRELLA_DATA.crafts[currentItem.selectedUmbrellaName as keyof typeof UMBRELLA_DATA.crafts] || []
  }

  const handleSixSmallItemsNameChange = (value: string) => {
    // 获取选中项的 label
    const selectedItem = SIX_SMALL_ITEMS_DATA.names.find((item) => item.key === value)
    console.log('value:', value)
    console.log('label:', selectedItem?.label)

    // 获取选中六小件的所有参数
    const textureOptions = SIX_SMALL_ITEMS_DATA.textures[value as keyof typeof SIX_SMALL_ITEMS_DATA.textures] || []
    const thicknessOptions = SIX_SMALL_ITEMS_DATA.thickness[value as keyof typeof SIX_SMALL_ITEMS_DATA.thickness] || []
    const lengthOptions = SIX_SMALL_ITEMS_DATA.length[value as keyof typeof SIX_SMALL_ITEMS_DATA.length] || []
    const widthOptions = SIX_SMALL_ITEMS_DATA.widths[value as keyof typeof SIX_SMALL_ITEMS_DATA.widths] || []
    const weightOptions = SIX_SMALL_ITEMS_DATA.weights[value as keyof typeof SIX_SMALL_ITEMS_DATA.weights] || []
    const craftOptions = SIX_SMALL_ITEMS_DATA.crafts[value as keyof typeof SIX_SMALL_ITEMS_DATA.crafts] || []

    // 自动填充联动字段
    form.setFieldsValue({
      name: selectedItem?.label, // 设置 name 字段为 label 值
      texture: textureOptions[0]?.value,
      thickness: thicknessOptions[0]?.value,
      length: lengthOptions[0]?.value,
      width: widthOptions[0]?.value,
      weight: weightOptions[0]?.value,
      craft: craftOptions[0]?.value
    })
  }
  const handleInquiry = async () => {
    try {
      setIsLoading(true) // 开始询价时设置状态
      setProgress(0)
      setDisplayedMarkdown('')
      setIsTyping(false) // 重置打字效果状态
      // 用于并发
      await Promise.all(
        items.map(async (item) => {
          console.log('item', item)
          // 非流式
          try {
            // 根据产品类型调用对应的非流式询价接口
            let response
            switch (item.category) {
              case 'room_card':
                response = await roomCardEnquiry({
                  material: item.material,
                  thickness: item.thickness || '',
                  length: item.length?.toString() || '',
                  width: item.width?.toString() || '',
                  craft: item.process?.join(';') || '',
                  chip: item.chip || '',
                  encrypt: item.encrypted || ''
                })
                break
              case 'slipper':
                response = await slipperEnquiry({
                  texture: item.texture || '',
                  size: item.size || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || '',
                  packaging: item.packaging || ''
                })
                break
              case 'pen':
                response = await penEnquiry({
                  texture: item.texture || '',
                  size: item.size || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || ''
                })
                break
              case 'umbrella':
                response = await umbrellaEnquiry({
                  name: item.name || '',
                  texture: item.texture || '',
                  size: item.size || '',
                  boneNum: item.boneNum || '',
                  handShank: item.handShank || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || ''
                })
                break
              case 'badge_lanyard':
                response = await badgeLanyardEnquiry({
                  name: item.name || '',
                  size: item.size || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || ''
                })
                break
              case 'six_small_items':
                response = await sixSmallItemsEnquiry({
                  name: item.name || '',
                  texture: item.texture || '',
                  thickness: item.thickness || '',
                  length: item.length?.toString() || '',
                  width: item.width?.toString() || '',
                  weight: item.weight?.toString() || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || ''
                })
                break
              default:
                throw new Error(`不支持的产品类型: ${item.category}`)
            }

            // 处理响应数据
            if (response && response.data) {
              const markdownContent = response.data
              if (markdownContent) {
                setFullMarkdown((prev) => [...prev, markdownContent])
              }
            }
          } catch (error) {
            console.error(`询价失败 (${item.category}):`, error)
            message.error(`询价失败 (${item.category}): ${error instanceof Error ? error.message : String(error)}`)
          }
        })
      )
    } catch (error) {
      console.error('询价失败:', error)
      message.error(error instanceof Error ? error.message : '询价失败，请重试')
    } finally {
      setIsLoading(false) // 询价结束时重置状态
      // 更新 displayedMarkdown 为最新的完整内容
      setDisplayedMarkdown(fullMarkdown.join('\n\n'))
    }
  }
  // 监听 fullMarkdown 的变化
  useEffect(() => {
    console.log('fullMarkdown 已更新:', fullMarkdown)
  }, [fullMarkdown])

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    if (typeof activeKey === 'string') {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.key === activeKey
            ? {
                ...item,
                ...allValues,
                // 如果是雨伞品类，确保更新 selectedUmbrellaName
                ...(item.category === 'umbrella' && allValues.name ? { selectedUmbrellaName: allValues.name } : {})
              }
            : item
        )
      )
    }
  }

  // 当 activeKey 变化时，重置表单值
  useEffect(() => {
    if (typeof activeKey === 'string') {
      const currentItem = items.find((item) => item.key === activeKey)
      if (currentItem) {
        form.setFieldsValue(currentItem)
      }
    }
  }, [activeKey, items, form])

  return (
    <Container>
      <ContentContainer>
        <SideNav>
          <ConfigProvider
            button={{
              className: styles.linearGradientButton
            }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<PlusOutlined />} onClick={handleAddCategory} disabled={items.length > 0}>
                新增询价品类
              </Button>
            </Space>
          </ConfigProvider>
          <Divider style={{ margin: '12px 0' }} />
          <div className="sidenav-scroll">
            {items.length > 0 ? (
              <Collapse onChange={onChange} activeKey={activeKey} items={items} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
          <div className="bottom-action">
            <Divider style={{ margin: '12px 0' }} />
            <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<AntDesignOutlined />} onClick={handleInquiry} loading={isLoading}>
                {isLoading ? '正在询价...' : '开始询价'}
              </Button>
            </Space>
          </div>
        </SideNav>
        <TableContainer right>
          <MarkdownContainer className={isTyping ? 'typing' : ''} ref={markdownContainerRef}>
            {isLoading && displayedMarkdown === '' && (
              <LoadingOverlay>
                <ProgressBar>
                  <ProgressFill style={{ width: `${progress}%` }} />
                </ProgressBar>
                <LoadingText>请稍后，正在询价中 {Math.round(progress)}%</LoadingText>
              </LoadingOverlay>
            )}
            {!isLoading && !displayedMarkdown ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Markdown
                message={{
                  id: 'markdown-content',
                  assistantId: 'default',
                  role: 'assistant',
                  content: displayedMarkdown,
                  topicId: 'default',
                  createdAt: new Date().toISOString(),
                  type: 'text',
                  status: 'success'
                }}
              />
            )}
          </MarkdownContainer>
        </TableContainer>
      </ContentContainer>
      <Modal
        title="新增品类"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        destroyOnClose>
        <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
          {getCategoryFormItems()}
        </Form>
      </Modal>
    </Container>
  )
}

export default InquiryPage
