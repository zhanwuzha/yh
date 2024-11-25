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
import {Button, Col, Drawer, Dropdown, Input, Row, Table} from 'antd';
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
import {fetchData, descData, DBHostDESC} from '../../../utils/duckDBTools'
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
  useEffect(() => {
    getData()
  }, [])


  const getData = async () => {
    const sql = `  SELECT * FROM '${DBHostDESC}'`
    let descData = await fetchData(sql)
    console.log(descData)
    descData && setDataSource(descData)
  }

  const columns = [
    {
      title: '基金名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '基金管理人',
      dataIndex: 'mgmt',
      key: 'mgmt',
    },
    {
      title: '基金托管人',
      dataIndex: 'custodian',
      key: 'custodian',
    },
    {
      title: '基金代码',
      dataIndex: 'ticker',
      key: 'ticker',
    },
    {
      title: '基金成立日',
      dataIndex: 'incept dt',
      key: 'incept dt',
      render: (text, record, index) => {
        return moment(text).format('YYYY-MM-DD')
      }
    },
  ];


  return (
    <PageContainer>

      <Table dataSource={dataSource} columns={columns}/>;
    </PageContainer>
  );
};
export default Analysis;
