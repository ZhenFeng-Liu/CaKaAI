import { AntDesignOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Scrollbar from '@renderer/components/Scrollbar'
import {
  Button,
  Checkbox,
  Collapse,
  ConfigProvider,
  Divider,
  Empty,
  Form,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space
} from 'antd'
import { createStyles } from 'antd-style'
import { FC, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'

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

  &.typing::after {
    content: '|';
    display: inline-block;
    animation: blink 1s step-end infinite;
    color: ${(props) => props.theme.colorPrimary};
    font-weight: bold;
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
    padding: 12px 16px;
    text-align: left;
    word-break: break-word;
    white-space: normal;
  }

  th {
    background-color: ${(props) => props.theme.colorBgLayout};
    font-weight: 500;
    color: ${(props) => props.theme.colorTextHeading};
  }

  tr:nth-child(even) {
    background-color: ${(props) => props.theme.colorBgLayout};
  }

  tr:hover {
    background-color: ${(props) => props.theme.colorBgTextHover};
  }

  a {
    color: ${(props) => props.theme.colorPrimary};
    text-decoration: underline;
  }
`

const DetailForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }
  .ant-form-item-label {
    padding-bottom: 4px;
  }
  .ant-form-item-label > label {
    color: var(--color-text-secondary);
    font-size: 14px;
  }
  .ant-form-item-control-input-content {
    color: var(--color-text);
    font-size: 14px;
  }
`

const DetailContainer = styled.div`
  padding: 16px;
`

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
  const [displayedMarkdown, setDisplayedMarkdown] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | undefined>()
  const [items, setItems] = useState<CategoryItem[]>([])
  const [activeKey, setActiveKey] = useState<string | string[]>([])
  // 添加拖鞋材质状态
  const [selectedTexture, setSelectedTexture] = useState<string>('')

  // 完整的 markdown 内容
  const fullMarkdown = `
# 询价单详情

## 基本信息
- **询价人**：easy
- **询价时间**：2025-05-28
- **生效时间**：2025-05-28
- **报价有效期**：15天

## 产品信息
| 询价编号 | 品类 | 材质 | 厚度(mm) | 长*宽(mm) | 产品工艺 | 芯片 | 是否加密 |
|---------|------|------|----------|-----------|----------|------|----------|
| 889 | 房卡 | 纸质 | 1.85 | 86.5*55 | 印刷,烫金 | CP.1.01.0372 | 是 |

## 报价详情
### 产品价格
- 1000张：0.5元/张
- 3000张：0.4元/张

### 样品信息
- **打样数量**：11张
- **样品费用**：101元
- **样品交期**：16天
- **大货交期**：16天

### 发票信息
- **发票类型**：普票
- **税率**：13%
`

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

  // 处理详情页表单提交
  const handleDetailFormSubmit = async (key: string, formValues: any) => {
    try {
      // 先打印表单信息
      console.log('详情页表单数据:', {
        key,
        category: items.find((item) => item.key === key)?.category,
        ...formValues
      })

      const currentItem = items.find((item) => item.key === key)
      if (!currentItem) return

      const updatedItem = {
        ...currentItem,
        ...formValues,
        label: formValues.category,
        children: currentItem.children // 保留原有的 children
      }

      setItems(items.map((item) => (item.key === key ? { ...updatedItem, extra: genExtra(updatedItem) } : item)))
    } catch (error) {
      console.error('保存失败:', error)
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
      'packaging'
    ])
  }

  // 处理拖鞋材质变化
  const handleTextureChange = (value: string) => {
    setSelectedTexture(value)
    // 重置尺码和工艺选择
    form.setFieldsValue({
      size: undefined,
      craft: undefined
    })
  }

  // 获取当前材质对应的尺码选项
  const getCurrentSizeOptions = () => {
    if (!selectedTexture) return []
    const textureKey = SLIPPER_DATA.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? SLIPPER_DATA.sizes[textureKey as keyof typeof SLIPPER_DATA.sizes] : []
  }

  // 获取当前材质对应的工艺选项
  const getCurrentCraftOptions = () => {
    if (!selectedTexture) return []
    const textureKey = SLIPPER_DATA.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? SLIPPER_DATA.crafts[textureKey as keyof typeof SLIPPER_DATA.crafts] : []
  }

  // 根据品类获取对应的表单字段
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
          <Form.Item key="size" label="尺码" name="size" rules={[{ required: true, message: '请选择尺码' }]}>
            <Radio.Group>
              {getCurrentSizeOptions().map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="craft" label="工艺" name="craft" rules={[{ required: true, message: '请选择工艺' }]}>
            <Checkbox.Group>
              {getCurrentCraftOptions().map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>,
          <Form.Item key="packaging" label="包装" name="packaging" rules={[{ required: true, message: '请选择包装' }]}>
            <Select>
              {SLIPPER_DATA.packaging.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ]
      case 'pen':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="color" label="颜色" name="color" rules={[{ required: true, message: '请选择颜色' }]}>
            <Select>
              <Select.Option value="黑色">黑色</Select.Option>
              <Select.Option value="蓝色">蓝色</Select.Option>
              <Select.Option value="红色">红色</Select.Option>
            </Select>
          </Form.Item>,
          <Form.Item key="type" label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
            <Radio.Group>
              <Radio value="圆珠笔">圆珠笔</Radio>
              <Radio value="中性笔">中性笔</Radio>
            </Radio.Group>
          </Form.Item>
        ]
      case 'badge_lanyard':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="size" label="尺寸" name="size" rules={[{ required: true, message: '请选择尺寸' }]}>
            <Radio.Group>
              <Radio value="小号">小号</Radio>
              <Radio value="中号">中号</Radio>
              <Radio value="大号">大号</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="process" label="工艺" name="process" rules={[{ required: true, message: '请选择工艺' }]}>
            <Checkbox.Group
              options={[
                { label: '印刷', value: '印刷' },
                { label: '烫金', value: '烫金' },
                { label: 'UV', value: 'UV' }
              ]}
            />
          </Form.Item>
        ]
      case 'umbrella':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="size" label="尺寸" name="size" rules={[{ required: true, message: '请选择尺寸' }]}>
            <Radio.Group>
              <Radio value="小号">小号</Radio>
              <Radio value="中号">中号</Radio>
              <Radio value="大号">大号</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="color" label="颜色" name="color" rules={[{ required: true, message: '请选择颜色' }]}>
            <Select>
              <Select.Option value="黑色">黑色</Select.Option>
              <Select.Option value="蓝色">蓝色</Select.Option>
              <Select.Option value="红色">红色</Select.Option>
            </Select>
          </Form.Item>
        ]
      case 'six_small_items':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              <Radio value="纸质">纸质</Radio>
              <Radio value="塑料">塑料</Radio>
              <Radio value="金属">金属</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item key="items" label="包含物品" name="items" rules={[{ required: true, message: '请选择包含物品' }]}>
            <Checkbox.Group
              options={[
                { label: '牙刷', value: '牙刷' },
                { label: '牙膏', value: '牙膏' },
                { label: '梳子', value: '梳子' },
                { label: '香皂', value: '香皂' },
                { label: '洗发水', value: '洗发水' },
                { label: '沐浴露', value: '沐浴露' }
              ]}
            />
          </Form.Item>
        ]
      default:
        return [categoryItem]
    }
  }

  // 修改详情页表单的渲染
  const renderDetailForm = (item: CategoryItem) => (
    <DetailContainer>
      <DetailForm
        layout="vertical"
        style={{ maxWidth: 600 }}
        initialValues={item}
        onValuesChange={(_, allValues) => handleDetailFormSubmit(item.key, allValues)}>
        <Form.Item label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
          <Radio.Group buttonStyle="outline">
            <Radio value="纸质">纸质</Radio>
            <Radio value="塑料">塑料</Radio>
            <Radio value="金属">金属</Radio>
          </Radio.Group>
        </Form.Item>
        {item.thickness && (
          <Form.Item label="厚度mm" name="thickness" rules={[{ required: true, message: '请选择厚度' }]}>
            <Radio.Group>
              <Radio value="1.85">1.85</Radio>
              <Radio value="2.0">2.0</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {item.length && (
          <Form.Item label="长mm" name="length" rules={[{ required: true, message: '请输入长度' }]}>
            <InputNumber min={1} />
          </Form.Item>
        )}
        {item.width && (
          <Form.Item label="宽mm" name="width" rules={[{ required: true, message: '请输入宽度' }]}>
            <InputNumber min={1} />
          </Form.Item>
        )}
        {item.process && (
          <Form.Item label="产品工艺" name="process" rules={[{ required: true, message: '请选择产品工艺' }]}>
            <Checkbox.Group
              options={[
                { label: '印刷', value: '印刷' },
                { label: '烫金', value: '烫金' },
                { label: 'UV', value: 'UV' }
              ]}
            />
          </Form.Item>
        )}
        {item.chip && (
          <Form.Item label="芯片" name="chip" rules={[{ required: true, message: '请选择芯片' }]}>
            <Select>
              <Select.Option value="CP.1.01.0372">CP.1.01.0372</Select.Option>
              <Select.Option value="CP.1.01.0373">CP.1.01.0373</Select.Option>
            </Select>
          </Form.Item>
        )}
        {item.encrypted && (
          <Form.Item label="是否加密" name="encrypted" rules={[{ required: true, message: '请选择是否加密' }]}>
            <Select>
              <Select.Option value="1">是</Select.Option>
              <Select.Option value="0">否</Select.Option>
            </Select>
          </Form.Item>
        )}
      </DetailForm>
    </DetailContainer>
  )

  // 加载进度条效果
  useEffect(() => {
    const duration = 3000 // 3秒
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

    return () => clearInterval(timer)
  }, [])

  // 原有的打字机效果
  useEffect(() => {
    let currentIndex = 0
    const interval = 50

    const timer = setInterval(() => {
      if (currentIndex <= fullMarkdown.length) {
        setDisplayedMarkdown(fullMarkdown.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <Container>
      <ContentContainer>
        <SideNav>
          <ConfigProvider
            button={{
              className: styles.linearGradientButton
            }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button icon={<PlusOutlined />} onClick={handleAddCategory}>
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
              <Button icon={<AntDesignOutlined />}>开始询价</Button>
            </Space>
          </div>
        </SideNav>
        <TableContainer right>
          <MarkdownContainer className={isTyping ? 'typing' : ''}>
            {isLoading && (
              <LoadingOverlay>
                <ProgressBar>
                  <ProgressFill style={{ width: `${progress}%` }} />
                </ProgressBar>
                <LoadingText>请稍后，正在询价中 {Math.round(progress)}%</LoadingText>
              </LoadingOverlay>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedMarkdown}</ReactMarkdown>
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
