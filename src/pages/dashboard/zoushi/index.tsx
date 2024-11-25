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
import {Select, DatePicker, Button, Card} from 'antd';
import type {RangePickerProps} from 'antd/es/date-picker/generatePicker';
import type {RadioChangeEvent} from 'antd/es/radio';
import type {FC} from 'react';
import React, {Suspense, useState, useEffect} from 'react';
import type {AnalysisData} from './data.d';
import {fetchData, descData, DBHostDESC, DBHostNAV} from '../../../utils/duckDBTools'
import {Pie, Line} from '@ant-design/charts';
import dayjs from 'dayjs';

const {RangePicker} = DatePicker;

type RangePickerValue = RangePickerProps<dayjs.Dayjs>['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type SalesType = 'all' | 'online' | 'stores';
const Analysis: FC<AnalysisProps> = () => {

  const [descSource, setDescSource] = useState([])
  useEffect(() => {
    getData()
  }, [])


  const getData = async () => {
    const sql = `  SELECT *
                   FROM '${DBHostDESC}'`
    let descData = await fetchData(sql)

    descData && setDescSource(descData)
    console.log(descData)
  }

  const [ticker, setTicker] = useState('')
  const onSelectChange = (value: any, option: any) => {
    console.log(value, option)
    setTicker(value)
  }
  let start, end
  const format = 'YYYY-MM-DD'
  const onDateChange = (dates: [dayjs, dayjs], dateStrings: [string, string]) => {
    console.log(dates, dateStrings)
    start = dates[0]?.format(format)
    end = dates[1]?.format(format)
  }

  const [searchData, setSearchData] = useState([])
  const onSearch = async () => {
    const sql = `  SELECT *
                   FROM '${DBHostNAV}'
                   WHERE ticker = '${ticker}'
                     AND epoch(cast (dt as date)) >= epoch(cast ('${start}' as DATE ))
                     AND epoch(cast (dt as date)) <= epoch(cast ('${end}' as DATE))`
    let descData = await fetchData(sql)
    let res = descData?.sort((a, b) => {
      return a.dt - b.dt
    })
    descData && setSearchData(res)
    console.log(descData)
  }

  return (
    <PageContainer>
      <Select style={{width: 240}} value={ticker}
              fieldNames={{label: 'ticker', value: 'ticker'}}
              options={descSource}
              onChange={onSelectChange}/>
      <RangePicker onChange={onDateChange}/>
      <Button style={{width: 80}} onClick={onSearch}>查询</Button>

      <Card style={{marginTop: 20}}>
        <Line
          title={'净值走势'}
          xField='dt'
          yField='nav'
          axis={{
            x:{
              title:"日期",
              labelFormatter:(datum, index, data, Vector)=>{return dayjs(datum).format(format)}
            }
          }}
          data={searchData}
        />
      </Card>
    </PageContainer>
  );
};
export default Analysis;
