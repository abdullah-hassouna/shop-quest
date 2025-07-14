"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { memo } from "react"

export const description = "An area chart with gradient fill"
console.log('Chart re-rendering'); // This will tell you if memo is working

interface ChartDescriptionType { title: string, desc: string }
interface ChartDataType { month: string, number: number }

interface chartConfigType extends ChartConfig {
    number: {
        label: string,
        color: string,
    },
}

const ChartAreaGradientUnoptmized = memo(({ chartDescription, chartData, chartConfig }: { chartDescription: ChartDescriptionType, chartData: ChartDataType[], chartConfig: chartConfigType }) => {


    return (
        <Card>
            <CardHeader>
                <CardTitle>{chartDescription.title}</CardTitle>
                <CardDescription>
                    {chartDescription.desc}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 10,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="20%"
                                    stopColor={chartConfig.number.color}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={chartConfig.number.color}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="number"
                            type="natural"
                            fill="url(#fillDesktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-number)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
})



export const ChartAreaGradient = ({ chartDescription, chartData, chartConfig, }: { chartDescription: ChartDescriptionType, chartData: ChartDataType[], chartConfig: chartConfigType }) => <ChartAreaGradientUnoptmized chartConfig={chartConfig} chartData={chartData} chartDescription={chartDescription} />;