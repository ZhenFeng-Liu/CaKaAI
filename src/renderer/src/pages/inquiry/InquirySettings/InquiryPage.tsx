import { AntDesignOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import bigLogoBg from '@renderer/assets/images/avatar_caka.png'
import Scrollbar from '@renderer/components/Scrollbar'
import Markdown from '@renderer/pages/home/Markdown/Markdown'
import type { AvatarProps } from 'antd'
import {
  Avatar,
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
  Space,
  Spin,
  Tooltip
} from 'antd'
import { createStyles } from 'antd-style'
import { debounce } from 'lodash'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  badgeLanyardEnquiry,
  DNDRoomCardEnquiry,
  exportEnquiry,
  penEnquiry,
  pvcStandardCardEnquiry,
  roomCardEnquiry,
  sixSmallItemsEnquiry,
  slipperEnquiry,
  smartProductsEnquiry,
  umbrellaEnquiry,
  WoodenRoomCardEnquiry
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

const MarkdownContainer = styled(Scrollbar)`
  position: relative !important; // 强制确保为 relative
  font-size: 15px;
  line-height: 1.8;
  color: ${(props) => props.theme.colorText};
  background: ${(props) => props.theme.colorBgContainer};
  border-radius: 8px;
  padding-bottom: 15px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* Markdown 基础样式 */
  .markdown-body {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text);
    padding: 20px;
    margin: 0 auto;
    width: 100%;
    overflow-x: auto;
    .markdown-content {
      white-space: normal;
    }
  }

  /* 确保 Markdown 组件样式正确显示 */
  .markdown {
    width: 100%;
    overflow-x: auto;
  }

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

// 定义品类类型：品类：room_card_wc--木卡房卡、room_card_dnd--DND房卡、pvc_standard_card--PVC房卡、slipper--拖鞋、room_card--房卡、pen--环保笔、umbrella--伞、badge_lanyard--胸牌、six_small_items--六小件
type CategoryType =
  | 'room_card_wc'
  | 'room_card_dnd'
  | 'room_card'
  | 'slipper'
  | 'pen'
  | 'badge_lanyard'
  | 'umbrella'
  | 'six_small_items'
  | 'pvc_standard_card'
  | 'smart_products'

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
  sales_quantity?: string
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
  // 房卡特有字段
  prod_length?: string
  prod_width?: string
  chip_material_code?: string
  magnetic?: string
  encrypt?: string
  select_craft?: string
  card_types?: string
  card_type?: string
}

// 定义品类选项
const CATEGORY_OPTIONS = [
  { label: '木质房卡', value: 'room_card_wc' },
  { label: '木质DND', value: 'room_card_dnd' },
  { label: 'PVC房卡', value: 'pvc_standard_card' },
  // { label: '房卡', value: 'room_card' },
  { label: '拖鞋', value: 'slipper' },
  { label: '环保笔', value: 'pen' },
  { label: '胸牌', value: 'badge_lanyard' },
  { label: '雨伞', value: 'umbrella' }
  // { label: '六小件', value: 'six_small_items' }
  // { label: '智慧产品', value: 'smart_products' }
]

// 木卡房卡相关常量数据
const INIT_ROOM_CARD_WC_DATA = {
  thickness: [
    {
      value: '1.1~1.3mm',
      label: '1.1~1.3mm'
    },
    {
      value: '1.31~1.55mm',
      label: '1.31~1.55mm'
    },
    {
      value: '1.56~2mm',
      label: '1.56~2mm'
    }
  ],
  material: [
    {
      value: '樱桃',
      label: '樱桃'
    },
    {
      value: '竹子',
      label: '竹子'
    },
    {
      value: '椴木',
      label: '椴木'
    },
    {
      value: '沙比利',
      label: '沙比利'
    },
    {
      value: '黑胡桃',
      label: '黑胡桃'
    },
    {
      value: '榉木',
      label: '榉木'
    },
    {
      value: '黑木',
      label: '黑木'
    }
  ],
  craft: [
    {
      value: '印刷',
      label: '印刷'
    },
    {
      value: '雕刻',
      label: '雕刻'
    }
  ],
  chip_material_code: [
    {
      value: '芯片-NXP S50 1k(4byte)-CL.001.00.001',
      label: '芯片-NXP S50 1k(4byte)-CL.001.00.001'
    },
    {
      value: '芯片-FM1108S(4byte)-CL.001.00.002',
      label: '芯片-FM1108S(4byte)-CL.001.00.002'
    },
    {
      value: '芯片-K50-CL.001.00.003',
      label: '芯片-K50-CL.001.00.003'
    },
    {
      value: '芯片-FM11RF32N-CL.001.00.004',
      label: '芯片-FM11RF32N-CL.001.00.004'
    },
    {
      value: '芯片-NXP S70 EV1-CL.001.00.005',
      label: '芯片-NXP S70 EV1-CL.001.00.005'
    },
    {
      value: '芯片-NXP S20-CL.001.00.006',
      label: '芯片-NXP S20-CL.001.00.006'
    },
    {
      value: '芯片-TK4100-CL.001.00.007',
      label: '芯片-TK4100-CL.001.00.007'
    },
    {
      value: '芯片-5200-CL.001.00.008',
      label: '芯片-5200-CL.001.00.008'
    },
    {
      value: '芯片-G36A-CL.001.00.009',
      label: '芯片-G36A-CL.001.00.009'
    },
    {
      value: '芯片-T5577-CL.001.00.010',
      label: '芯片-T5577-CL.001.00.010'
    },
    {
      value: '芯片-2K-90-CL.001.00.011',
      label: '芯片-2K-90-CL.001.00.011'
    },
    {
      value: '芯片-旧版2K-CL.001.00.012',
      label: '芯片-旧版2K-CL.001.00.012'
    },
    {
      value: '芯片-EM4305-CL.001.00.013',
      label: '芯片-EM4305-CL.001.00.013'
    },
    {
      value: '芯片-NXP Ultralight EV1(48byte)-CL.001.00.014',
      label: '芯片-NXP Ultralight EV1(48byte)-CL.001.00.014'
    },
    {
      value: '芯片-G36B-CL.001.00.015',
      label: '芯片-G36B-CL.001.00.015'
    },
    {
      value: '芯片-NXP Ultralight C(17PF)-CL.001.00.016',
      label: '芯片-NXP Ultralight C(17PF)-CL.001.00.016'
    },
    {
      value: '芯片-SRI512-CL.001.00.017',
      label: '芯片-SRI512-CL.001.00.017'
    },
    {
      value: '芯片-SRE55VO2P-CL.001.00.018',
      label: '芯片-SRE55VO2P-CL.001.00.018'
    },
    {
      value: '芯片-I CODE SLI-CL.001.00.019',
      label: '芯片-I CODE SLI-CL.001.00.019'
    },
    {
      value: '芯片-NXP S50(gc)-CL.001.00.020',
      label: '芯片-NXP S50(gc)-CL.001.00.020'
    },
    {
      value: '芯片-CUID-CL.001.00.021',
      label: '芯片-CUID-CL.001.00.021'
    },
    {
      value: '芯片-UID-CL.001.00.022',
      label: '芯片-UID-CL.001.00.022'
    },
    {
      value: '芯片-ISSI4439-CL.001.00.023',
      label: '芯片-ISSI4439-CL.001.00.023'
    },
    {
      value: '芯片-FM S50-CL.001.00.024',
      label: '芯片-FM S50-CL.001.00.024'
    },
    {
      value: '芯片-TI 2K-CL.001.00.025',
      label: '芯片-TI 2K-CL.001.00.025'
    },
    {
      value: '芯片-UL-EV1 COB(48byte)-CL.001.00.026',
      label: '芯片-UL-EV1 COB(48byte)-CL.001.00.026'
    },
    {
      value: '芯片-G36A 晶圆-CL.001.00.027',
      label: '芯片-G36A 晶圆-CL.001.00.027'
    },
    {
      value: '芯片-新版2K-CL.001.00.028',
      label: '芯片-新版2K-CL.001.00.028'
    },
    {
      value: '芯片-FM1280-194-A1-CL.001.00.030',
      label: '芯片-FM1280-194-A1-CL.001.00.030'
    },
    {
      value: '芯片-FM1280-198-C1-CL.001.00.031',
      label: '芯片-FM1280-198-C1-CL.001.00.031'
    },
    {
      value: '芯片-NXP NTAG213-CL.001.00.029',
      label: '芯片-NXP NTAG213-CL.001.00.029'
    },
    {
      value: '芯片-gc ULT -C-CL.001.00.032',
      label: '芯片-gc ULT -C-CL.001.00.032'
    },
    {
      value: '芯片-NXP DESFire EV1 2K(7byte)-CL.001.005',
      label: '芯片-NXP DESFire EV1 2K(7byte)-CL.001.005'
    },
    {
      value: '芯片-NXP DESFire EV1 4K(7byte)-CL.001.006',
      label: '芯片-NXP DESFire EV1 4K(7byte)-CL.001.006'
    },
    {
      value: '芯片-PLUS X 4K 7B-CL.001.007',
      label: '芯片-PLUS X 4K 7B-CL.001.007'
    },
    {
      value: '芯片-NXP Plus EV1 4K-CL.001.008',
      label: '芯片-NXP Plus EV1 4K-CL.001.008'
    },
    {
      value: '芯片-NXP Plus EV1 2K-CL.001.009',
      label: '芯片-NXP Plus EV1 2K-CL.001.009'
    },
    {
      value: '芯片-HT4168-CL.001.010',
      label: '芯片-HT4168-CL.001.010'
    },
    {
      value: '芯片-FM11RM08S-CL.001.011',
      label: '芯片-FM11RM08S-CL.001.011'
    },
    {
      value: '芯片-NXP D81(7byte)-CL.001.012',
      label: '芯片-NXP D81(7byte)-CL.001.012'
    },
    {
      value: '芯片-Hitag 2-CL.001.013',
      label: '芯片-Hitag 2-CL.001.013'
    },
    {
      value: '芯片-NXP Ultralight EV1(128bytes）-CL.001.014',
      label: '芯片-NXP Ultralight EV1(128bytes）-CL.001.014'
    },
    {
      value: '芯片-NXP S50 EV1(7byte）-CL.001.00.033',
      label: '芯片-NXP S50 EV1(7byte）-CL.001.00.033'
    },
    {
      value: '芯片-NXP PLUS X 2K(7byte)-CL.001.015',
      label: '芯片-NXP PLUS X 2K(7byte)-CL.001.015'
    },
    {
      value: '芯片-NXP NTAG215-CL.001.016',
      label: '芯片-NXP NTAG215-CL.001.016'
    },
    {
      value: '芯片-I CODE SLIX2-CL.001.00.034',
      label: '芯片-I CODE SLIX2-CL.001.00.034'
    },
    {
      value: '芯片-MCU-CL.001.00.035',
      label: '芯片-MCU-CL.001.00.035'
    },
    {
      value: '芯片-NXP D42-CL.001.00.036',
      label: '芯片-NXP D42-CL.001.00.036'
    },
    {
      value: '芯片-NXP D22-CL.001.00.037',
      label: '芯片-NXP D22-CL.001.00.037'
    },
    {
      value: '芯片-NXP D82 70pf-CL.001.00.038',
      label: '芯片-NXP D82 70pf-CL.001.00.038'
    },
    {
      value: '芯片-JT1024 -CL.001.00.039',
      label: '芯片-JT1024 -CL.001.00.039'
    },
    {
      value: '芯片-NXP PLUS S 2K(7byte)-CL.001.00.040',
      label: '芯片-NXP PLUS S 2K(7byte)-CL.001.00.040'
    },
    {
      value: '芯片-NTAG216-CL.001.0017',
      label: '芯片-NTAG216-CL.001.0017'
    },
    {
      value: '芯片-NXP DESFire EV3 4K(7byte)-CL.001.0018',
      label: '芯片-NXP DESFire EV3 4K(7byte)-CL.001.0018'
    },
    {
      value: '芯片-FM1280-7102-C1-CL.001.0019',
      label: '芯片-FM1280-7102-C1-CL.001.0019'
    },
    {
      value: '芯片-I CDOE SLI X -CL.001.0020',
      label: '芯片-I CDOE SLI X -CL.001.0020'
    },
    {
      value: '芯片-NXP Desfire EV1 8K(7byte)-CL.001.0021',
      label: '芯片-NXP Desfire EV1 8K(7byte)-CL.001.0021'
    },
    {
      value: '芯片-NXP Desfire EV2 2K(7byte)-CL.001.0022',
      label: '芯片-NXP Desfire EV2 2K(7byte)-CL.001.0022'
    },
    {
      value: '芯片-NXP Desfire EV3 2K(7byte)-CL.001.0023',
      label: '芯片-NXP Desfire EV3 2K(7byte)-CL.001.0023'
    },
    {
      value: '芯片-NXP DESFire EV2 4K(7byte)-CL.001.0024',
      label: '芯片-NXP DESFire EV2 4K(7byte)-CL.001.0024'
    },
    {
      value: '芯片-NXP Desfire EV2 8K(7byte)-CL.001.0025',
      label: '芯片-NXP Desfire EV2 8K(7byte)-CL.001.0025'
    },
    {
      value: '芯片-MIFARE Ultralight AES-CL.001.0026',
      label: '芯片-MIFARE Ultralight AES-CL.001.0026'
    },
    {
      value: '芯片-NXP ULT AES-CL.001.0027',
      label: '芯片-NXP ULT AES-CL.001.0027'
    },
    {
      value: '芯片-EM4200-CL.001.0028',
      label: '芯片-EM4200-CL.001.0028'
    },
    {
      value: '芯片-UHF 9662-CL.001.0029',
      label: '芯片-UHF 9662-CL.001.0029'
    },
    {
      value: '芯片-NXP S70 7B-CL.001.0030',
      label: '芯片-NXP S70 7B-CL.001.0030'
    },
    {
      value: '芯片-MIFARE Plus EV2 2K -CL.001.0031',
      label: '芯片-MIFARE Plus EV2 2K -CL.001.0031'
    },
    {
      value: '芯片-NXP Ultralight C wafer(17PF)-CL.001.0032',
      label: '芯片-NXP Ultralight C wafer(17PF)-CL.001.0032'
    },
    {
      value: '芯片-Hitag 2-CL.001.0033',
      label: '芯片-Hitag 2-CL.001.0033'
    },
    {
      value: '芯片-FM24C02-CL.001.0034',
      label: '芯片-FM24C02-CL.001.0034'
    },
    {
      value: '芯片-NXP UL-C 50PF-CL.001.0035',
      label: '芯片-NXP UL-C 50PF-CL.001.0035'
    },
    {
      value: '芯片-NXP DESFire Light -CL.001.0036',
      label: '芯片-NXP DESFire Light -CL.001.0036'
    },
    {
      value: '芯片-NXP Hitag 1-CL.001.0037',
      label: '芯片-NXP Hitag 1-CL.001.0037'
    },
    {
      value: '辅料配件-LED发光灯珠COB-CL.001.0038',
      label: '辅料配件-LED发光灯珠COB-CL.001.0038'
    },
    {
      value: '芯片-MIFARE Plus EV2 4K -CL.001.0039',
      label: '芯片-MIFARE Plus EV2 4K -CL.001.0039'
    },
    {
      value: '芯片-MIFARE Plus EV2 4k(7byte)-CL.001.0040',
      label: '芯片-MIFARE Plus EV2 4k(7byte)-CL.001.0040'
    },
    {
      value: '芯片-Monza R6-CL.001.0041',
      label: '芯片-Monza R6-CL.001.0041'
    },
    {
      value: '芯片-CPU(FM1208-09)-CL.001.00.0042',
      label: '芯片-CPU(FM1208-09)-CL.001.00.0042'
    },
    {
      value: '芯片-MIFARE Classic EV1 1K(7byte)-CL.001.00.0043',
      label: '芯片-MIFARE Classic EV1 1K(7byte)-CL.001.00.0043'
    },
    {
      value: '芯片-NXP S50 EV1(4byte）-CL.001.00.0044',
      label: '芯片-NXP S50 EV1(4byte）-CL.001.00.0044'
    }
  ]
}

// DND房卡相关常量数据
const INIT_ROOM_CARD_DND_DATA = {
  thickness: [
    {
      value: '3mm',
      label: '3mm'
    },
    {
      value: '5mm',
      label: '5mm'
    }
  ],
  material: [
    {
      value: '樱桃',
      label: '樱桃'
    },
    {
      value: '竹子',
      label: '竹子'
    },
    {
      value: '椴木',
      label: '椴木'
    },
    {
      value: '沙比利',
      label: '沙比利'
    },
    {
      value: '黑胡桃',
      label: '黑胡桃'
    },
    {
      value: '榉木',
      label: '榉木'
    }
  ],
  craft: [
    {
      value: '印刷',
      label: '印刷'
    },
    {
      value: '雕刻',
      label: '雕刻'
    }
  ]
}

// 拖鞋相关常量数据
const INIT_SLIPPER_DATA = {
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
const INIT_PEN_DATA = {
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
const INIT_BADEG_LANYARD_DATA = {
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
const INIT_UMBRELLA_DATA = {
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
const INIT_SIX_SMALL_ITEMS_DATA = {
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

// PVC房卡数据
const INIT_PVC_STANDARD_CARD_DATA = {
  sizes: [
    {
      value: '85.5',
      label: '长度'
    },
    {
      value: '54',
      label: '宽度'
    }
  ],
  card_types: [
    {
      value: '芯片卡',
      label: '芯片卡'
    },
    {
      value: '磁条卡',
      label: '磁条卡'
    }
  ],
  encrypt: [
    {
      value: '是',
      label: '是'
    },
    {
      value: '否',
      label: '否'
    }
  ],
  craft: [
    {
      value: '磨砂面卡',
      label: '磨砂面卡'
    },
    {
      value: '烫金/银LOGO',
      label: '烫金/银LOGO'
    },
    {
      value: 'UV光油',
      label: 'UV光油'
    },
    {
      value: '潘通色',
      label: '潘通色'
    },
    {
      value: '打孔5MM',
      label: '打孔5MM'
    },
    {
      value: '打孔3*15MM',
      label: '打孔3*15MM'
    },
    {
      value: '冲缺口',
      label: '冲缺口'
    },
    {
      value: '编印条形码',
      label: '编印条形码'
    },
    {
      value: '编印号码黑色',
      label: '编印号码黑色'
    },
    {
      value: '编印号码金/银/白色',
      label: '编印号码金/银/白色'
    },
    {
      value: '编印二维码',
      label: '编印二维码'
    },
    {
      value: '凸码烫金/银',
      label: '凸码烫金/银'
    },
    {
      value: '套OPP袋子',
      label: '套OPP袋子'
    },
    {
      value: '套连体OPP袋子',
      label: '套连体OPP袋子'
    },
    {
      value: '保护膜',
      label: '保护膜'
    },
    {
      value: '刮刮膜',
      label: '刮刮膜'
    },
    {
      value: 'UV防伪蓝',
      label: 'UV防伪蓝'
    },
    {
      value: '橙色激光码',
      label: '橙色激光码'
    },
    {
      value: '白色签名条/透明签名条',
      label: '白色签名条/透明签名条'
    }
  ],
  magnetic: [
    {
      value: '300 OE磁条',
      label: '300 OE磁条'
    },
    {
      value: '650 OE磁条',
      label: '650 OE磁条'
    },
    {
      value: '2750 OE磁条',
      label: '2750 OE磁条'
    },
    {
      value: '4000 OE磁条',
      label: '4000 OE磁条'
    }
  ],
  chip_material_code: [
    {
      value: '芯片-NXP S50 1k(4byte)-CL.001.00.001',
      label: '芯片-NXP S50 1k(4byte)-CL.001.00.001'
    },
    {
      value: '芯片-FM1108S(4byte)-CL.001.00.002',
      label: '芯片-FM1108S(4byte)-CL.001.00.002'
    },
    {
      value: '芯片-K50-CL.001.00.003',
      label: '芯片-K50-CL.001.00.003'
    },
    {
      value: '芯片-FM11RF32N-CL.001.00.004',
      label: '芯片-FM11RF32N-CL.001.00.004'
    },
    {
      value: '芯片-NXP S70 EV1-CL.001.00.005',
      label: '芯片-NXP S70 EV1-CL.001.00.005'
    },
    {
      value: '芯片-NXP S20-CL.001.00.006',
      label: '芯片-NXP S20-CL.001.00.006'
    },
    {
      value: '芯片-TK4100-CL.001.00.007',
      label: '芯片-TK4100-CL.001.00.007'
    },
    {
      value: '芯片-5200-CL.001.00.008',
      label: '芯片-5200-CL.001.00.008'
    },
    {
      value: '芯片-G36A-CL.001.00.009',
      label: '芯片-G36A-CL.001.00.009'
    },
    {
      value: '芯片-T5577-CL.001.00.010',
      label: '芯片-T5577-CL.001.00.010'
    },
    {
      value: '芯片-2K-90-CL.001.00.011',
      label: '芯片-2K-90-CL.001.00.011'
    },
    {
      value: '芯片-旧版2K-CL.001.00.012',
      label: '芯片-旧版2K-CL.001.00.012'
    },
    {
      value: '芯片-EM4305-CL.001.00.013',
      label: '芯片-EM4305-CL.001.00.013'
    },
    {
      value: '芯片-NXP Ultralight EV1(48byte)-CL.001.00.014',
      label: '芯片-NXP Ultralight EV1(48byte)-CL.001.00.014'
    },
    {
      value: '芯片-G36B-CL.001.00.015',
      label: '芯片-G36B-CL.001.00.015'
    },
    {
      value: '芯片-NXP Ultralight C(17PF)-CL.001.00.016',
      label: '芯片-NXP Ultralight C(17PF)-CL.001.00.016'
    },
    {
      value: '芯片-SRI512-CL.001.00.017',
      label: '芯片-SRI512-CL.001.00.017'
    },
    {
      value: '芯片-SRE55VO2P-CL.001.00.018',
      label: '芯片-SRE55VO2P-CL.001.00.018'
    },
    {
      value: '芯片-I CODE SLI-CL.001.00.019',
      label: '芯片-I CODE SLI-CL.001.00.019'
    },
    {
      value: '芯片-NXP S50(gc)-CL.001.00.020',
      label: '芯片-NXP S50(gc)-CL.001.00.020'
    },
    {
      value: '芯片-CUID-CL.001.00.021',
      label: '芯片-CUID-CL.001.00.021'
    },
    {
      value: '芯片-UID-CL.001.00.022',
      label: '芯片-UID-CL.001.00.022'
    },
    {
      value: '芯片-ISSI4439-CL.001.00.023',
      label: '芯片-ISSI4439-CL.001.00.023'
    },
    {
      value: '芯片-FM S50-CL.001.00.024',
      label: '芯片-FM S50-CL.001.00.024'
    },
    {
      value: '芯片-TI 2K-CL.001.00.025',
      label: '芯片-TI 2K-CL.001.00.025'
    },
    {
      value: '芯片-UL-EV1 COB(48byte)-CL.001.00.026',
      label: '芯片-UL-EV1 COB(48byte)-CL.001.00.026'
    },
    {
      value: '芯片-G36A 晶圆-CL.001.00.027',
      label: '芯片-G36A 晶圆-CL.001.00.027'
    },
    {
      value: '芯片-新版2K-CL.001.00.028',
      label: '芯片-新版2K-CL.001.00.028'
    },
    {
      value: '芯片-FM1280-194-A1-CL.001.00.030',
      label: '芯片-FM1280-194-A1-CL.001.00.030'
    },
    {
      value: '芯片-FM1280-198-C1-CL.001.00.031',
      label: '芯片-FM1280-198-C1-CL.001.00.031'
    },
    {
      value: '芯片-NXP NTAG213-CL.001.00.029',
      label: '芯片-NXP NTAG213-CL.001.00.029'
    },
    {
      value: '芯片-gc ULT -C-CL.001.00.032',
      label: '芯片-gc ULT -C-CL.001.00.032'
    },
    {
      value: '芯片-NXP DESFire EV1 2K(7byte)-CL.001.005',
      label: '芯片-NXP DESFire EV1 2K(7byte)-CL.001.005'
    },
    {
      value: '芯片-NXP DESFire EV1 4K(7byte)-CL.001.006',
      label: '芯片-NXP DESFire EV1 4K(7byte)-CL.001.006'
    },
    {
      value: '芯片-PLUS X 4K 7B-CL.001.007',
      label: '芯片-PLUS X 4K 7B-CL.001.007'
    },
    {
      value: '芯片-NXP Plus EV1 4K-CL.001.008',
      label: '芯片-NXP Plus EV1 4K-CL.001.008'
    },
    {
      value: '芯片-NXP Plus EV1 2K-CL.001.009',
      label: '芯片-NXP Plus EV1 2K-CL.001.009'
    },
    {
      value: '芯片-HT4168-CL.001.010',
      label: '芯片-HT4168-CL.001.010'
    },
    {
      value: '芯片-FM11RM08S(7byte)-CL.001.011',
      label: '芯片-FM11RM08S(7byte)-CL.001.011'
    },
    {
      value: '芯片-NXP D81(7byte)-CL.001.012',
      label: '芯片-NXP D81(7byte)-CL.001.012'
    },
    {
      value: '芯片-Hitag 2-CL.001.013',
      label: '芯片-Hitag 2-CL.001.013'
    },
    {
      value: '芯片-NXP Ultralight EV1(128bytes）-CL.001.014',
      label: '芯片-NXP Ultralight EV1(128bytes）-CL.001.014'
    },
    {
      value: '芯片-NXP S50 EV1(7byte）-CL.001.00.033',
      label: '芯片-NXP S50 EV1(7byte）-CL.001.00.033'
    },
    {
      value: '芯片-NXP PLUS X 2K(7byte)-CL.001.015',
      label: '芯片-NXP PLUS X 2K(7byte)-CL.001.015'
    },
    {
      value: '芯片-NXP NTAG215-CL.001.016',
      label: '芯片-NXP NTAG215-CL.001.016'
    },
    {
      value: '芯片-I CODE SLIX2-CL.001.00.034',
      label: '芯片-I CODE SLIX2-CL.001.00.034'
    },
    {
      value: '芯片-MCU-CL.001.00.035',
      label: '芯片-MCU-CL.001.00.035'
    },
    {
      value: '芯片-NXP D42-CL.001.00.036',
      label: '芯片-NXP D42-CL.001.00.036'
    },
    {
      value: '芯片-NXP D22-CL.001.00.037',
      label: '芯片-NXP D22-CL.001.00.037'
    },
    {
      value: '芯片-NXP D82 70pf-CL.001.00.038',
      label: '芯片-NXP D82 70pf-CL.001.00.038'
    },
    {
      value: '芯片-JT1024 -CL.001.00.039',
      label: '芯片-JT1024 -CL.001.00.039'
    },
    {
      value: '芯片-NXP PLUS S 2K(7byte)-CL.001.00.040',
      label: '芯片-NXP PLUS S 2K(7byte)-CL.001.00.040'
    },
    {
      value: '芯片-NTAG216-CL.001.0017',
      label: '芯片-NTAG216-CL.001.0017'
    },
    {
      value: '芯片-NXP DESFire EV3 4K(7byte)-CL.001.0018',
      label: '芯片-NXP DESFire EV3 4K(7byte)-CL.001.0018'
    },
    {
      value: '芯片-FM1280-7102-C1-CL.001.0019',
      label: '芯片-FM1280-7102-C1-CL.001.0019'
    },
    {
      value: '芯片-I CDOE SLI X -CL.001.0020',
      label: '芯片-I CDOE SLI X -CL.001.0020'
    },
    {
      value: '芯片-NXP Desfire EV1 8K(7byte)-CL.001.0021',
      label: '芯片-NXP Desfire EV1 8K(7byte)-CL.001.0021'
    },
    {
      value: '芯片-NXP Desfire EV2 2K(7byte)-CL.001.0022',
      label: '芯片-NXP Desfire EV2 2K(7byte)-CL.001.0022'
    },
    {
      value: '芯片-NXP Desfire EV3 2K(7byte)-CL.001.0023',
      label: '芯片-NXP Desfire EV3 2K(7byte)-CL.001.0023'
    },
    {
      value: '芯片-NXP DESFire EV2 4K(7byte)-CL.001.0024',
      label: '芯片-NXP DESFire EV2 4K(7byte)-CL.001.0024'
    },
    {
      value: '芯片-NXP Desfire EV2 8K(7byte)-CL.001.0025',
      label: '芯片-NXP Desfire EV2 8K(7byte)-CL.001.0025'
    },
    {
      value: '芯片-EM4200-CL.001.0028',
      label: '芯片-EM4200-CL.001.0028'
    },
    {
      value: '芯片-UHF 9662-CL.001.0029',
      label: '芯片-UHF 9662-CL.001.0029'
    },
    {
      value: '芯片-NXP S70 7B-CL.001.0030',
      label: '芯片-NXP S70 7B-CL.001.0030'
    },
    {
      value: '芯片-MIFARE Plus EV2 2K -CL.001.0031',
      label: '芯片-MIFARE Plus EV2 2K -CL.001.0031'
    },
    {
      value: '芯片-NXP Ultralight C wafer(17PF)-CL.001.0032',
      label: '芯片-NXP Ultralight C wafer(17PF)-CL.001.0032'
    },
    {
      value: '芯片-Hitag 2-CL.001.0033',
      label: '芯片-Hitag 2-CL.001.0033'
    },
    {
      value: '芯片-FM24C02-CL.001.0034',
      label: '芯片-FM24C02-CL.001.0034'
    },
    {
      value: '芯片-NXP UL-C 50PF-CL.001.0035',
      label: '芯片-NXP UL-C 50PF-CL.001.0035'
    },
    {
      value: '芯片-NXP DESFire Light -CL.001.0036',
      label: '芯片-NXP DESFire Light -CL.001.0036'
    },
    {
      value: '芯片-NXP Hitag 1-CL.001.0037',
      label: '芯片-NXP Hitag 1-CL.001.0037'
    },
    {
      value: '辅料配件-LED发光灯珠COB-CL.001.0038',
      label: '辅料配件-LED发光灯珠COB-CL.001.0038'
    },
    {
      value: '芯片-MIFARE Plus EV2 4K -CL.001.0039',
      label: '芯片-MIFARE Plus EV2 4K -CL.001.0039'
    },
    {
      value: '芯片-MIFARE Plus EV2 4k(7byte)-CL.001.0040',
      label: '芯片-MIFARE Plus EV2 4k(7byte)-CL.001.0040'
    },
    {
      value: '芯片-Monza R6-CL.001.0041',
      label: '芯片-Monza R6-CL.001.0041'
    },
    {
      value: '芯片-CPU(FM1208-09)-CL.001.00.0042',
      label: '芯片-CPU(FM1208-09)-CL.001.00.0042'
    },
    {
      value: '芯片-MIFARE Classic EV1 1K(7byte)-CL.001.00.0043',
      label: '芯片-MIFARE Classic EV1 1K(7byte)-CL.001.00.0043'
    },
    {
      value: '芯片-NXP S50 EV1(4byte）-CL.001.00.0044',
      label: '芯片-NXP S50 EV1(4byte）-CL.001.00.0044'
    },
    {
      value: '无芯片',
      label: '无芯片'
    }
  ],
  thickness: [
    {
      value: '0.79-0.81',
      label: '厚度'
    }
  ]
}

// 智慧产品
const SMART_PRODUCTS_DATA = {
  names: [
    {
      key: 'L1',
      value: '激光雕刻机K9',
      label: '激光雕刻机K9'
    },
    {
      key: 'L2',
      value: 'K9配件-滤芯',
      label: 'K9配件-滤芯'
    },
    {
      key: 'L3',
      value: 'K9配件-电源线',
      label: 'K9配件-电源线'
    },
    {
      key: 'L4',
      value: 'K9配件-数据线',
      label: 'K9配件-数据线'
    },
    {
      key: 'L5',
      value: 'K9配件-激光器',
      label: 'K9配件-激光器'
    },
    {
      key: 'L6',
      value: 'K9配件-灯条',
      label: 'K9配件-灯条'
    },
    {
      key: 'L7',
      value: 'K9配件-步进电机',
      label: 'K9配件-步进电机'
    },
    {
      key: 'L8',
      value: '净化器风机',
      label: '净化器风机'
    },
    {
      key: 'L9',
      value: '卡盒',
      label: '卡盒'
    },
    {
      key: 'L10',
      value: 'K9配件-挡光板',
      label: 'K9配件-挡光板'
    }
  ],
  textures: {
    L1: [
      {
        label: 'ABS(外壳），长宽高为415*260*220',
        value: 'ABS(外壳），长宽高为415*260*220'
      }
    ],
    L2: [
      {
        label: '120*110*100mm',
        value: '120*110*100mm'
      }
    ],
    L3: [
      {
        label: '',
        value: ''
      }
    ],
    L4: [
      {
        label: '',
        value: ''
      }
    ],
    L5: [
      {
        label: '40+40*110mm,5W压缩光驱动板＋气咀',
        value: '40+40*110mm,5W压缩光驱动板＋气咀'
      }
    ],
    L6: [
      {
        label: '126-11.9mm,12V LED 灯',
        value: '126-11.9mm,12V LED 灯'
      }
    ],
    L7: [
      {
        label: '42步进，42*42*35mm，轴长17.5mm，保持力矩280mN. m .PH2.0-6P接口，防锈抗腐蚀',
        value: '42步进，42*42*35mm，轴长17.5mm，保持力矩280mN. m .PH2.0-6P接口，防锈抗腐蚀'
      }
    ],
    L8: [
      {
        label: '120*120*32mm，台达BFC1212A12V/2A转速3700RPM配A34线 XH -4P端子，线长450mm',
        value: '120*120*32mm，台达BFC1212A12V/2A转速3700RPM配A34线 XH -4P端子，线长450mm'
      }
    ],
    L9: [
      {
        label: '70*100mm, ABS 材料，内外面喷油半光亚银灰色 PANTONE 20-0001TPM',
        value: '70*100mm, ABS 材料，内外面喷油半光亚银灰色 PANTONE 20-0001TPM'
      }
    ],
    L10: [
      {
        label: '',
        value: ''
      }
    ]
  }
}

// 定义品类标签映射
const CATEGORY_LABEL_MAP: Record<CategoryType, string> = {
  room_card_wc: '木质房卡',
  room_card_dnd: '木质DND',
  room_card: '房卡',
  slipper: '拖鞋',
  pen: '环保笔',
  badge_lanyard: '胸牌',
  umbrella: '雨伞',
  six_small_items: '六小件',
  pvc_standard_card: 'PVC房卡',
  smart_products: '智慧产品'
}

const InquiryPage: FC = () => {
  const { styles } = useStyle()
  const [displayedMarkdown, setDisplayedMarkdown] = useState<string>('')
  const [isTyping, setIsTyping] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
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
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle')
  const [uniqueId, setUniqueId] = useState<string>('')
  const [downloadError, setDownloadError] = useState<string>('')
  // 添加询价完成状态
  const [isInquiryCompleted, setIsInquiryCompleted] = useState<boolean>(false)
  // 添加数据返回状态跟踪
  // const [dataReturned, setDataReturned] = useState<boolean>(false)

  // 品类参数数据用 useState 管理
  const [roomCardWcData, setRoomCardWcData] = useState(INIT_ROOM_CARD_WC_DATA)
  const [roomCardDndData, setRoomCardDndData] = useState(INIT_ROOM_CARD_DND_DATA)
  const [slipperData, setSlipperData] = useState(INIT_SLIPPER_DATA)
  const [penData, setPenData] = useState(INIT_PEN_DATA)
  const [badgeLanyardData, setBadgeLanyardData] = useState(INIT_BADEG_LANYARD_DATA)
  const [umbrellaData, setUmbrellaData] = useState(INIT_UMBRELLA_DATA)
  const [sixSmallItemsData, setSixSmallItemsData] = useState(INIT_SIX_SMALL_ITEMS_DATA)
  const [pvcStandardCardData, setPvcStandardCardData] = useState(INIT_PVC_STANDARD_CARD_DATA)
  const [smartProductsData, setSmartProductsData] = useState(SMART_PRODUCTS_DATA)
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

        // 重置询价完成状态
        setIsInquiryCompleted(false)

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
        prod_length: values.prod_length,
        prod_width: values.prod_width,
        chip_material_code: values.chip_material_code,
        magnetic: values.magnetic,
        encrypt: values.encrypt,
        card_type: values.card_types,
        sales_quantity: values.sales_quantity,
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
          prod_length: values.prod_length,
          prod_width: values.prod_width,
          chip_material_code: values.chip_material_code,
          magnetic: values.magnetic,
          encrypt: values.encrypt,
          children: null,
          extra: null,
          card_type: values.card_types,
          select_craft: values.select_craft,
          sales_quantity: values.sales_quantity
        }),
        extra: null
      }

      setItems([...items, { ...newItem, extra: genExtra(newItem) }])
      setActiveKey(newKey)
      setIsModalOpen(false)
      setSelectedCategory(undefined)
      form.resetFields()
      // 重置询价完成状态
      setIsInquiryCompleted(false)
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
    const textureKey = slipperData.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? slipperData.sizes[textureKey as keyof typeof slipperData.sizes] : []
  }

  const getCurrentCraftOptions = () => {
    if (!selectedTexture) return []
    const textureKey = slipperData.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? slipperData.crafts[textureKey as keyof typeof slipperData.crafts] : []
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
      case 'room_card_wc':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              {roomCardWcData.material.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item
            key="thickness"
            label="厚度mm"
            name="thickness"
            rules={[{ required: true, message: '请选择厚度' }]}>
            <Radio.Group>
              {roomCardWcData.thickness.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item
            key="prod_length"
            label="长mm"
            name="prod_length"
            rules={[{ required: true, message: '请输入长度' }]}>
            <InputNumber min={1} />
          </Form.Item>,
          <Form.Item
            key="prod_width"
            label="宽mm"
            name="prod_width"
            rules={[{ required: true, message: '请输入宽度' }]}>
            <InputNumber min={1} />
          </Form.Item>,
          <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: false, message: '请选择产品工艺' }]}>
            <Checkbox.Group options={roomCardWcData.craft} />
          </Form.Item>,
          <Form.Item
            key="chip_material_code"
            label="芯片"
            name="chip_material_code"
            rules={[{ required: true, message: '请选择芯片' }]}>
            <Select
              showSearch
              filterOption={(input, option) =>
                String(option?.value ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }>
              {roomCardWcData.chip_material_code.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item
            key="encrypt"
            label="是否加密"
            name="encrypt"
            rules={[{ required: true, message: '请选择是否加密' }]}>
            <Select>
              <Select.Option value="是">是</Select.Option>
              <Select.Option value="否">否</Select.Option>
            </Select>
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
          </Form.Item>
        ]
      case 'room_card_dnd':
        return [
          categoryItem,
          <Form.Item key="material" label="材质" name="material" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline">
              {roomCardDndData.material.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item
            key="thickness"
            label="厚度mm"
            name="thickness"
            rules={[{ required: true, message: '请选择厚度' }]}>
            <Radio.Group>
              {roomCardDndData.thickness.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item
            key="prod_length"
            label="长mm"
            name="prod_length"
            rules={[{ required: true, message: '请输入长度' }]}>
            <InputNumber min={1} />
          </Form.Item>,
          <Form.Item
            key="prod_width"
            label="宽mm"
            name="prod_width"
            rules={[{ required: true, message: '请输入宽度' }]}>
            <InputNumber min={1} />
          </Form.Item>,
          <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: false, message: '请选择产品工艺' }]}>
            <Checkbox.Group options={roomCardDndData.craft} />
          </Form.Item>
          // <Form.Item
          //   key="sales_quantity"
          //   label="销售数量"
          //   name="sales_quantity"
          //   rules={[{ required: false, message: '请输入销售数量' }]}>
          //   <InputNumber min={0} />
          // </Form.Item>
        ]
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
            rules={[{ required: false, message: '请选择产品工艺' }]}>
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
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
          </Form.Item>
        ]
      case 'slipper':
        return [
          categoryItem,
          <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group onChange={(e) => handleTextureChange(e.target.value)}>
              {slipperData.textures.map((option) => (
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
              {slipperData.packaging.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
          </Form.Item>
        ]
      case 'pen':
        return [
          categoryItem,
          <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
            <Radio.Group buttonStyle="outline" onChange={(e) => handlePenTextureChange(e.target.value)}>
              {penData.textures.map((texture) => (
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
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
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
              {badgeLanyardData.names.map((option) => (
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
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
          </Form.Item>
        ]
      case 'umbrella':
        return [
          categoryItem,
          <Form.Item key="name" label="产品名称" name="name" rules={[{ required: true, message: '请选择产品名称' }]}>
            <Select onChange={handleUmbrellaNameChange} placeholder="请选择产品">
              {umbrellaData.names.map((item) => (
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
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
          </Form.Item>
        ]
      case 'six_small_items':
        return [
          categoryItem,
          <Form.Item key="name" label="产品名称" name="name" rules={[{ required: true, message: '请选择产品名称' }]}>
            <Select onChange={handleSixSmallItemsNameChange} placeholder="请选择产品">
              {sixSmallItemsData.names.map((item) => (
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
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
          </Form.Item>
        ]
      case 'pvc_standard_card':
        return [
          categoryItem,
          <Form.Item
            key="length"
            label="长度mm"
            name="length"
            initialValue={85.5}
            rules={[{ required: true, message: '请输入长度' }]}>
            <InputNumber min={1} disabled />
          </Form.Item>,
          <Form.Item
            key="width"
            label="宽度mm"
            name="width"
            initialValue={54}
            rules={[{ required: true, message: '请输入宽度' }]}>
            <InputNumber min={1} disabled />
          </Form.Item>,
          <Form.Item
            key="thickness"
            label="厚度mm"
            name="thickness"
            rules={[{ required: true, message: '请选择厚度' }]}>
            <Radio.Group>
              {pvcStandardCardData.thickness.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.value}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          // 卡类型默认选择芯片
          <Form.Item
            key="card_types"
            label="卡类型"
            name="card_types"
            rules={[{ required: true, message: '请选择卡类型' }]}>
            <Radio.Group>
              {pvcStandardCardData.card_types.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>,
          <Form.Item dependencies={['card_types']} noStyle key="dynamic_card_type">
            {({ getFieldValue }) => {
              const type = getFieldValue('card_types')
              if (type === '芯片卡') {
                return (
                  <>
                    <Form.Item
                      key="chip_material_code"
                      label="芯片"
                      name="chip_material_code"
                      rules={[{ required: true, message: '请选择芯片' }]}>
                      <Select>
                        {pvcStandardCardData.chip_material_code.map((option) => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      key="encrypt"
                      label="是否加密"
                      name="encrypt"
                      rules={[{ required: true, message: '请选择是否加密' }]}>
                      <Select>
                        <Select.Option value="是">是</Select.Option>
                        <Select.Option value="否">否</Select.Option>
                      </Select>
                    </Form.Item>
                  </>
                )
              }
              if (type === '磁条卡') {
                return (
                  <Form.Item
                    key="magnetic"
                    label="磁条"
                    name="magnetic"
                    rules={[{ required: true, message: '请选择磁条' }]}>
                    <Select>
                      {pvcStandardCardData.magnetic.map((option) => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )
              }
              return null
            }}
          </Form.Item>,
          <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: false, message: '请选择工艺' }]}>
            <Select mode="multiple">
              {pvcStandardCardData.craft.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
          </Form.Item>
        ]
      case 'smart_products':
        return [
          categoryItem,
          <Form.Item key="name" label="产品名称" name="name" rules={[{ required: true, message: '请选择产品名称' }]}>
            <Select onChange={(e) => handleSmartProductsChange(e)} placeholder="请选择产品">
              {smartProductsData.names.map((item) => (
                <Select.Option key={item.key} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item key="texture" label="材质/参数" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
            <Select>
              {getCurrentTexturesOptions().map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>,
          <Form.Item
            key="sales_quantity"
            label="销售数量"
            name="sales_quantity"
            rules={[{ required: false, message: '请输入销售数量' }]}>
            <InputNumber min={0} />
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
          {item.category === 'room_card_wc' && (
            <>
              <Form.Item
                key="material"
                label="材质"
                name="material"
                rules={[{ required: true, message: '请选择材质' }]}>
                <Radio.Group buttonStyle="outline">
                  {roomCardWcData.material.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                key="thickness"
                label="厚度mm"
                name="thickness"
                rules={[{ required: true, message: '请选择厚度' }]}>
                <Radio.Group>
                  {roomCardWcData.thickness.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                key="prod_length"
                label="长mm"
                name="prod_length"
                rules={[{ required: true, message: '请输入长度' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item
                key="prod_width"
                label="宽mm"
                name="prod_width"
                rules={[{ required: true, message: '请输入宽度' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item
                key="craft"
                label="产品工艺"
                name="craft"
                rules={[{ required: false, message: '请选择产品工艺' }]}>
                <Checkbox.Group options={roomCardWcData.craft} />
              </Form.Item>
              <Form.Item
                key="chip_material_code"
                label="芯片"
                name="chip_material_code"
                rules={[{ required: true, message: '请选择芯片' }]}>
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.value ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }>
                  {roomCardWcData.chip_material_code.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="encrypt"
                label="是否加密"
                name="encrypt"
                rules={[{ required: true, message: '请选择是否加密' }]}>
                <Select>
                  <Select.Option value="是">是</Select.Option>
                  <Select.Option value="否">否</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </>
          )}

          {item.category === 'room_card_dnd' && (
            <>
              <Form.Item
                key="material"
                label="材质"
                name="material"
                rules={[{ required: true, message: '请选择材质' }]}>
                <Radio.Group buttonStyle="outline">
                  {roomCardDndData.material.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                key="thickness"
                label="厚度mm"
                name="thickness"
                rules={[{ required: true, message: '请选择厚度' }]}>
                <Radio.Group>
                  {roomCardDndData.thickness.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                key="prod_length"
                label="长mm"
                name="prod_length"
                rules={[{ required: true, message: '请输入长度' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item
                key="prod_width"
                label="宽mm"
                name="prod_width"
                rules={[{ required: true, message: '请输入宽度' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item
                key="craft"
                label="产品工艺"
                name="craft"
                rules={[{ required: false, message: '请选择产品工艺' }]}>
                <Checkbox.Group options={roomCardDndData.craft} />
              </Form.Item>
              {/* <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
              </Form.Item> */}
            </>
          )}

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
                rules={[{ required: false, message: '请选择产品工艺' }]}>
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
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </>
          )}

          {item.category === 'slipper' && (
            <>
              <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
                <Radio.Group onChange={(e) => handleTextureChange(e.target.value)}>
                  {slipperData.textures.map((option) => (
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
                  {slipperData.packaging.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
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
                  {badgeLanyardData.names.map((option) => (
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
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </>
          )}

          {item.category === 'pen' && (
            <>
              <Form.Item key="texture" label="材质" name="texture" rules={[{ required: true, message: '请选择材质' }]}>
                <Radio.Group buttonStyle="outline" onChange={(e) => handlePenTextureChange(e.target.value)}>
                  {penData.textures.map((texture) => (
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
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
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
                  {umbrellaData.names.map((item) => (
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
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
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
                  {sixSmallItemsData.names.map((item) => (
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
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </>
          )}

          {item.category === 'pvc_standard_card' && (
            <>
              <Form.Item key="length" label="长度mm" name="length" rules={[{ required: true, message: '请输入长度' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item key="width" label="宽度mm" name="width" rules={[{ required: true, message: '请输入宽度' }]}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item
                key="thickness"
                label="厚度mm"
                name="thickness"
                rules={[{ required: true, message: '请选择厚度' }]}>
                <Radio.Group>
                  {pvcStandardCardData.thickness.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.value}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item
                key="card_types"
                label="卡类型"
                name="card_types"
                rules={[{ required: true, message: '请选择卡类型' }]}>
                <Radio.Group>
                  {pvcStandardCardData.card_types.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item dependencies={['card_types']} noStyle key="dynamic_card_type">
                {({ getFieldValue }) => {
                  const type = getFieldValue('card_types')
                  if (type === '芯片卡') {
                    return (
                      <>
                        <Form.Item
                          key="chip_material_code"
                          label="芯片"
                          name="chip_material_code"
                          rules={[{ required: true, message: '请选择芯片' }]}>
                          <Select>
                            {pvcStandardCardData.chip_material_code.map((option) => (
                              <Select.Option key={option.value} value={option.value}>
                                {option.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          key="encrypt"
                          label="是否加密"
                          name="encrypt"
                          rules={[{ required: true, message: '请选择是否加密' }]}>
                          <Select>
                            <Select.Option value="是">是</Select.Option>
                            <Select.Option value="否">否</Select.Option>
                          </Select>
                        </Form.Item>
                      </>
                    )
                  }
                  if (type === '磁条卡') {
                    return (
                      <Form.Item
                        key="magnetic"
                        label="磁条"
                        name="magnetic"
                        rules={[{ required: true, message: '请选择磁条' }]}>
                        <Select>
                          {pvcStandardCardData.magnetic.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )
                  }
                  return null
                }}
              </Form.Item>
              <Form.Item key="craft" label="产品工艺" name="craft" rules={[{ required: false, message: '请选择工艺' }]}>
                <Select mode="multiple">
                  {pvcStandardCardData.craft.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </>
          )}

          {item.category === 'smart_products' && (
            <>
              <Form.Item
                key="name"
                label="产品名称"
                name="name"
                rules={[{ required: true, message: '请选择产品名称' }]}>
                <Select onChange={(e) => handleSmartProductsChange(e)} placeholder="请选择产品">
                  {smartProductsData.names.map((item) => (
                    <Select.Option key={item.key} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="texture"
                label="材质/参数"
                name="texture"
                rules={[{ required: true, message: '请选择材质' }]}>
                <Select>
                  {getCurrentTexturesOptions().map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                key="sales_quantity"
                label="销售数量"
                name="sales_quantity"
                rules={[{ required: false, message: '请输入销售数量' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </>
          )}
        </Form>
      </div>
    )
  }

  const renderDetailForm = (item: CategoryItem) => <DetailFormComponent item={item} form={form} />

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

  const handlePrintProdTypeParams = async (category) => {
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
        case 'room_card_wc':
          setRoomCardWcData(res.data)
          console.log('roomCardWcData', res.data)
          break
        case 'room_card_dnd':
          setRoomCardDndData(res.data)
          console.log('roomCardDndData', res.data)
          break
        case 'slipper':
          // 适配接口返回的 packagings 字段为 packaging，保证前端渲染安全
          setSlipperData({
            ...res.data,
            packaging: res.data.packagings || []
          })
          console.log('slipperData', { ...res.data, packaging: res.data.packagings || [] })
          break
        case 'pen':
          setPenData(res.data)
          console.log('penData', res.data)
          break
        case 'badge_lanyard':
          setBadgeLanyardData(res.data)
          console.log('badgeLanyardData', res.data)
          break
        case 'umbrella':
          setUmbrellaData(res.data)
          console.log('umbrellaData', res.data)
          break
        case 'six_small_items':
          setSixSmallItemsData(res.data)
          console.log('sixSmallItemsData', res.data)
          break
        case 'pvc_standard_card':
          setPvcStandardCardData(res.data)
          console.log('pvcStandardCardData', res.data)
          break
        case 'smart_products':
          setSmartProductsData(res.data)
          console.log('smartProductsData', res.data)
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
    const textureKey = penData.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? penData.sizes[textureKey as keyof typeof penData.sizes] : []
  }

  const getCurrentPenCraftOptions = () => {
    if (!selectedTexture) return []
    const textureKey = penData.textures.find((t) => t.value === selectedTexture)?.key
    return textureKey ? penData.crafts[textureKey as keyof typeof penData.crafts] : []
  }

  const handleBadgeLanyardNameChange = (value: string) => {
    // 获取选中项的 label
    const selectedItem = badgeLanyardData.names.find((item) => item.key === value)
    console.log('value:', value)
    console.log('label:', selectedItem?.label)

    // 获取选中胸牌的所有参数
    const sizeOptions = badgeLanyardData.sizes[value as keyof typeof badgeLanyardData.sizes] || []
    const craftOptions = badgeLanyardData.crafts[value as keyof typeof badgeLanyardData.crafts] || []

    // 自动填充联动字段
    form.setFieldsValue({
      name: selectedItem?.label, // 设置 name 字段为 label 值
      size: sizeOptions[0]?.value,
      craft: craftOptions[0]?.value
    })
  }

  const handleUmbrellaNameChange = (value: string) => {
    // 获取选中项的 label
    const selectedItem = umbrellaData.names.find((item) => item.key === value)
    console.log('value:', value)
    console.log('label:', selectedItem?.label)

    // 获取选中雨伞的所有参数
    const boneNumOptions = umbrellaData.boneNums[value as keyof typeof umbrellaData.boneNums] || []
    const handShankOptions = umbrellaData.handShanks[value as keyof typeof umbrellaData.handShanks] || []
    const sizeOptions = umbrellaData.sizes[value as keyof typeof umbrellaData.sizes] || []
    const craftOptions = umbrellaData.crafts[value as keyof typeof umbrellaData.crafts] || []
    const textureOptions = umbrellaData.textures[value as keyof typeof umbrellaData.textures] || []

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
    return umbrellaData.boneNums[currentItem.selectedUmbrellaName as keyof typeof umbrellaData.boneNums] || []
  }

  const getCurrentHandShankOptions = () => {
    const currentItem = items.find((item) => item.key === activeKey)
    if (!currentItem?.selectedUmbrellaName) return []
    return umbrellaData.handShanks[currentItem.selectedUmbrellaName as keyof typeof umbrellaData.handShanks] || []
  }

  const getCurrentUmbrellaSizeOptions = () => {
    const currentItem = items.find((item) => item.key === activeKey)
    if (!currentItem?.selectedUmbrellaName) return []
    return umbrellaData.sizes[currentItem.selectedUmbrellaName as keyof typeof umbrellaData.sizes] || []
  }

  const getCurrentUmbrellaCraftOptions = () => {
    const currentItem = items.find((item) => item.key === activeKey)
    if (!currentItem?.selectedUmbrellaName) return []
    return umbrellaData.crafts[currentItem.selectedUmbrellaName as keyof typeof umbrellaData.crafts] || []
  }

  const handleSixSmallItemsNameChange = (value: string) => {
    // 获取选中项的 label
    const selectedItem = sixSmallItemsData.names.find((item) => item.key === value)
    console.log('value:', value)
    console.log('label:', selectedItem?.label)

    // 获取选中六小件的所有参数
    const textureOptions = sixSmallItemsData.textures[value as keyof typeof sixSmallItemsData.textures] || []
    const thicknessOptions = sixSmallItemsData.thickness[value as keyof typeof sixSmallItemsData.thickness] || []
    const lengthOptions = sixSmallItemsData.length[value as keyof typeof sixSmallItemsData.length] || []
    const widthOptions = sixSmallItemsData.widths[value as keyof typeof sixSmallItemsData.widths] || []
    const weightOptions = sixSmallItemsData.weights[value as keyof typeof sixSmallItemsData.weights] || []
    const craftOptions = sixSmallItemsData.crafts[value as keyof typeof sixSmallItemsData.crafts] || []

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

  const handleSmartProductsChange = (value: string) => {
    console.log(value)
    setSelectedTexture(value)
    // 重置尺码和工艺选择
    form.setFieldsValue({
      texture: undefined
    })
    // 获取选中项的 label
    // const selectedItem = smartProductsData.names.find((item) => item.key === value)
    // console.log('value:', value)
    // console.log('label:', selectedItem?.label)

    // 获取选中的所有参数
    // const textureOptions = smartProductsData.textures[value as keyof typeof smartProductsData.textures] || []
    // 自动填充联动字段
    // form.setFieldsValue({
    //   texture: textureOptions[0]?.value
    // })
  }

  const getCurrentTexturesOptions = () => {
    if (!selectedTexture) return []
    const textureKey = smartProductsData.names.find((t) => t.value === selectedTexture)?.key
    return textureKey ? smartProductsData.textures[textureKey as keyof typeof smartProductsData.textures] : []
  }

  const handleInquiry = async () => {
    try {
      setIsLoading(true) // 开始询价时设置状态
      setIsTyping(false) // 重置打字效果状态
      // 重置下载状态
      setDownloadStatus('idle')
      setUniqueId('')
      setDownloadError('')
      // setDataReturned(false) // 重置数据返回状态

      // 用于并发
      await Promise.all(
        items.map(async (item) => {
          console.log('item', item)
          // 非流式
          try {
            // 根据产品类型调用对应的非流式询价接口
            let response
            switch (item.category) {
              case 'room_card_wc':
                response = await WoodenRoomCardEnquiry({
                  material: item.material,
                  thickness: item.thickness || '',
                  prod_length: item.prod_length?.toString() || '',
                  prod_width: item.prod_width?.toString() || '',
                  craft: item.craft?.join('+') || '',
                  chip_material_code: item.chip_material_code || '',
                  encrypt: item.encrypt || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
                })
                break
              case 'room_card_dnd':
                response = await DNDRoomCardEnquiry({
                  material: item.material,
                  thickness: item.thickness || '',
                  prod_length: item.prod_length?.toString() || '',
                  prod_width: item.prod_width?.toString() || '',
                  craft: item.craft?.join('+') || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
                })
                break
              case 'room_card':
                response = await roomCardEnquiry({
                  material: item.material,
                  thickness: item.thickness || '',
                  length: item.length?.toString() || '',
                  width: item.width?.toString() || '',
                  craft: item.process?.join(';') || '',
                  chip: item.chip || '',
                  encrypt: item.encrypted || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
                })
                break
              case 'slipper':
                response = await slipperEnquiry({
                  texture: item.texture || '',
                  size: item.size || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || '',
                  packaging: item.packaging || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
                })
                break
              case 'pen':
                response = await penEnquiry({
                  texture: item.texture || '',
                  size: item.size || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
                })
                break
              case 'umbrella':
                response = await umbrellaEnquiry({
                  name: item.name || '',
                  texture: item.texture || '',
                  size: item.size || '',
                  boneNum: item.boneNum || '',
                  handShank: item.handShank || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
                })
                break
              case 'badge_lanyard':
                response = await badgeLanyardEnquiry({
                  name: item.name || '',
                  size: item.size || '',
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
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
                  craft: Array.isArray(item.craft) ? item.craft.join(',') : item.craft || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
                })
                break
              case 'pvc_standard_card':
                response = await pvcStandardCardEnquiry({
                  // name: item.name || '',
                  card_type: item.card_type || '',
                  magnetic: item.magnetic || '',
                  chip_material_code: item.chip_material_code || '',
                  prod_length: item.length?.toString() || '',
                  prod_width: item.width?.toString() || '',
                  encrypt: item.encrypt?.toString() || '',
                  select_craft: [
                    ...(Array.isArray(item.craft) ? item.craft : item.craft ? [item.craft] : []),
                    ...(item.magnetic ? [item.magnetic] : [])
                  ],
                  thickness: item.thickness || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
                })
                break
              case 'smart_products':
                response = await smartProductsEnquiry({
                  name: item.name || '',
                  texture: item.texture || '',
                  sales_quantity: item.sales_quantity?.toString() || '0'
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

              // 提取unique_id（如果响应中包含）
              if (response.unique_id) {
                setUniqueId(response.unique_id)
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
      // 延迟1.5秒后关闭遮罩层
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
      setIsInquiryCompleted(true) // 设置询价完成状态
      // 更新 displayedMarkdown 为最新的完整内容
      setDisplayedMarkdown(fullMarkdown.join('\n\n'))
    }
  }
  // 监听 fullMarkdown 的变化
  useEffect(() => {
    console.log('fullMarkdown 已更新:', fullMarkdown)
  }, [fullMarkdown])

  const handleFormValuesChange = (
    // changedValues: any,
    allValues: any
  ) => {
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
        form.setFieldsValue({
          ...currentItem,
          // / 明确指定所有动态字段
          card_types: currentItem.card_type,
          chip_material_code: currentItem.chip_material_code,
          magnetic: currentItem.magnetic,
          encrypt: currentItem.encrypt
        })
        // 再次打印
        setTimeout(() => {
          console.log('form fields after set:', form.getFieldsValue())
        }, 100)
      }
    }
  }, [activeKey, items, form])

  // 处理下载功能
  const handleDownload = async () => {
    if (!uniqueId) {
      message.error('该询价结果不支持下载')
      return
    }

    setDownloadStatus('downloading')
    setDownloadError('')

    try {
      await exportEnquiry(uniqueId, `询价结果_${new Date().toISOString().split('T')[0]}.xlsx`)
      setDownloadStatus('success')
      message.success('询价结果下载成功')
    } catch (error) {
      setDownloadStatus('error')
      const errorMessage = error instanceof Error ? error.message : '下载失败'
      setDownloadError(errorMessage)
      message.error(`下载失败: ${errorMessage}`)
    } finally {
      // 3秒后重置状态
      setTimeout(() => {
        setDownloadStatus('idle')
        setDownloadError('')
      }, 3000)
    }
  }

  // 每次弹窗打开都重置表单和品类选择
  useEffect(() => {
    if (isModalOpen) {
      setSelectedCategory(undefined)
      setTimeout(() => {
        form.resetFields()
      }, 0)
    }
  }, [isModalOpen, form])

  return (
    <Container>
      <ContentContainer>
        <SideNav>
          <ConfigProvider
            button={{
              className: styles.linearGradientButton
            }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                icon={<PlusOutlined />}
                onClick={handleAddCategory}
                disabled={items.length > 0 || isInquiryCompleted}>
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
              <Button
                icon={<AntDesignOutlined />}
                onClick={handleInquiry}
                loading={isLoading}
                disabled={items.length === 0 || isInquiryCompleted}>
                {isLoading ? '正在询价...' : '开始询价'}
              </Button>
            </Space>
          </div>
        </SideNav>
        <TableContainer right>
          <MarkdownContainer className={isTyping ? 'typing' : ''} ref={markdownContainerRef}>
            {isLoading ? (
              <StyledOverlay>
                <Spin tip="Loading" size="large" />
                <div className="ant-spin-text">Caka正在为您生成报价，请耐心等候...</div>
              </StyledOverlay>
            ) : !displayedMarkdown ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="markdown-body">
                <MessageContainer>
                  <AvatarWrapper>
                    <StyledAvatar size={36} src={bigLogoBg}></StyledAvatar>
                  </AvatarWrapper>
                  <ContentWrapper>
                    <TimeWrapper>{new Date().toLocaleString()}</TimeWrapper>
                    <MarkdownContent>
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
                      {/* 如果unique_id存在，显示下载按钮 */}
                      {uniqueId && (
                        <DownloadButtonWrapper>
                          <Divider variant="dotted" style={{ margin: '0' }} />
                          <Tooltip title={downloadStatus === 'downloading' ? '下载中...' : '下载询价结果'}>
                            <Button
                              size="small"
                              icon={<DownloadOutlined />}
                              loading={downloadStatus === 'downloading'}
                              onClick={handleDownload}
                              disabled={downloadStatus === 'downloading'}
                              style={{ marginTop: '12px' }}
                            />
                          </Tooltip>
                          {downloadStatus === 'error' && <ErrorMessage>{downloadError}</ErrorMessage>}
                        </DownloadButtonWrapper>
                      )}
                    </MarkdownContent>
                  </ContentWrapper>
                </MessageContainer>
              </div>
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

const MessageContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 8px 0;
`

const AvatarWrapper = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StyledAvatar = styled(Avatar)<AvatarProps>`
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.5px solid var(--color-border);
`

const TimeWrapper = styled.div`
  font-size: 12px;
  color: var(--color-text-3);
  line-height: 1.2;
`

const MarkdownContent = styled.div`
  .markdown-content {
    margin-top: 0;
  }
`

const DownloadButtonWrapper = styled.div`
  gap: 8px;
`

const ErrorMessage = styled.div`
  color: var(--color-error);
  font-size: 12px;
  line-height: 1.2;
`

const StyledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colorBgContainer};
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & .ant-spin-text {
    display: block !important;
    color: ${(props) => props.theme.colorText} !important;
    font-size: 16px !important;
    margin-top: 16px !important;
    text-align: center !important;
    opacity: 1 !important;
    background: none !important;
  }
`

export default InquiryPage
