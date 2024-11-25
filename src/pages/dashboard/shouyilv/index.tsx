import {EllipsisOutlined, PlusOutlined} from '@ant-design/icons';
import {
  FooterToolbar,
  GridContent,
  ModalForm,
  PageContainer, ProDescriptions, ProDescriptionsItemProps,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components';
import {Outlet, useRequest} from '@umijs/max';
import {Button, Col, Drawer, Dropdown, Input, Select, Table} from 'antd';
import type {RangePickerProps} from 'antd/es/date-picker/generatePicker';
import type {RadioChangeEvent} from 'antd/es/radio';
import type dayjs from 'dayjs';
import type {FC} from 'react';
import React, {Suspense, useState, useEffect} from 'react';
import IntroduceRow from './components/IntroduceRow';
import OfflineData from './components/OfflineData';
import PageLoading from './components/PageLoading';
import ProportionSales from './components/ProportionSales';
import type {TimeType} from './components/SalesCard';
import SalesCard from './components/SalesCard';
import TopSearch from './components/TopSearch';
import type {AnalysisData} from './data.d';
import {fakeChartData} from './service';
import useStyles from './style.style';
import {getTimeDistance} from './utils/utils';
import {DBHostDESC, DBHostNAV, fetchData} from '../../../utils/duckDBTools'
import {TableListItem, TableListPagination} from "@/pages/list/table-list/data";
import {rule} from "@/pages/list/table-list/service";
import UpdateForm from "@/pages/list/table-list/components/UpdateForm";
import moment from 'moment'


type RangePickerValue = RangePickerProps<dayjs.Dayjs>['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type SalesType = 'all' | 'online' | 'stores';
const Analysis: FC<AnalysisProps> = () => {

  const [dataSource, setDataSource] = useState([])
  const [selectArray, setSelectArray] = useState([])
  useEffect(() => {
    init()
  }, [])
  const init = async () => {
    const sql = `  SELECT * FROM '${DBHostDESC}'`
    let descData = await fetchData(sql)
    setSelectArray(descData?.map?.((item) => {
      return {
        title: item.name,
        label: item.name,
        value: item.ticker
      }
    }))
  }

  const handleChange = async (value) => {
    const sql = `WITH chg AS (SELECT ticker,
                                     nav,
                                     dt,
                                     LAG(nav)
                                       OVER(ORDER BY dt) AS prev_nav
                              FROM '${DBHostNAV}' where ticker = '${value}')
    SELECT dt, ticker, nav, (nav - prev_nav) - 1 AS chg
    FROM chg`
    let descData = await fetchData(sql)
    descData && setDataSource(descData)
  }


  const columns = [
    {
      title: '名称',
      dataIndex: 'ticker',
      key: 'ticker',
    },
    {
      title: '净值',
      dataIndex: 'nav',
      key: 'nav',
    },
    {
      title: '净值日期',
      dataIndex: 'dt',
      key: 'dt',
      render: (text, record, index) => {
        return moment(text).format('YYYY-MM-DD')
      }
    },
    {
      title: '日收益率',
      dataIndex: 'chg',
      key: 'chg',
    },
  ];


  return (
    <PageContainer>
      <Select
        style={{width: 200, marginBottom: 20}}
        defaultValue={selectArray?.[0]?.value}
        onChange={handleChange}
        options={selectArray}
      />

      <Table dataSource={dataSource} columns={columns}/>;
    </PageContainer>
  );
};
export default Analysis;
