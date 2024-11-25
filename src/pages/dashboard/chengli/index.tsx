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
import {Button, Col, Drawer, Dropdown, Input, Row,Table} from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type { RadioChangeEvent } from 'antd/es/radio';
import type dayjs from 'dayjs';
import type { FC } from 'react';
import React, { Suspense, useState,useEffect } from 'react';
import IntroduceRow from './components/IntroduceRow';
import OfflineData from './components/OfflineData';
import PageLoading from './components/PageLoading';
import ProportionSales from './components/ProportionSales';
import type { TimeType } from './components/SalesCard';
import SalesCard from './components/SalesCard';
import TopSearch from './components/TopSearch';
import type { AnalysisData } from './data.d';
import { fakeChartData } from './service';
import useStyles from './style.style';
import { getTimeDistance } from './utils/utils';
import {fetchData, descData, DBHost, DBHostDESC} from '../../../utils/duckDBTools'
import {TableListItem, TableListPagination} from "@/pages/list/table-list/data";
import {rule} from "@/pages/list/table-list/service";
import UpdateForm from "@/pages/list/table-list/components/UpdateForm";
import moment from 'moment'
import {Column} from "@ant-design/plots";


type RangePickerValue = RangePickerProps<dayjs.Dayjs>['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type SalesType = 'all' | 'online' | 'stores';
const Analysis: FC<AnalysisProps> = () => {

  const[dataSource,setDataSource]=useState([])
  useEffect( ()=>{
    getData()
  },[])


  const getData = async ()=>{
    // const sql = `SELECT date_part('year', TIMESTAMP epoch_ms(TIMESTAMP CAST('incept dt' AS TIMESTAMP ))) AS year,COUNT(*) AS counnt FROM '${DBHostDESC}' GROUP BY year ORDER BY year`
    const sql = `  SELECT * FROM '${DBHostDESC}'`
    let descData = await fetchData(sql)
    console.log(descData)
    let dateMap = new Map

    descData.forEach((item)=>{
      let year = new Date(item['incept dt']).getFullYear()
      let count = dateMap.get(year)?.count || 0
      dateMap.set(year, {count: ++count, year: year})
    })
    let res = Array.from(dateMap.values()).sort((a,b)=>{
      return a.year-b.year
    })
    console.log(res)
    descData && setDataSource(res)
  }

  const config = {
    data: dataSource,
    xField: 'year',
    yField: 'count',
    axis:{
      y:{title:'基金成立数量'}
    },
    label: {
      text: (d) => {return d.count },
      textBaseline: 'bottom',
    },
    style: {
      // 圆角样式
      radiusTopLeft: 10,
      radiusTopRight: 10,
    },
  };
  return (
    <PageContainer>
      <Column {...config} />
    </PageContainer>
  );
};
export default Analysis;
