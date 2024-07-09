import * as React from 'react'
import { ChartProps } from '../Chart';
import { Data } from '../types';
import Candlestick from './Candlestick'

export interface MainSeriesProps extends Omit<ChartProps, "children"> {
    data: Data;
  }

export default function MainSeries(props: MainSeriesProps) {
  return (
      <Candlestick {...props}/>
  )
}
