'use client' 

import MetricCard from '@/app/components/dashboard/metricCard'
import { useSavingsOpportunities } from '@/lib/hooks/useSavingsOpportunities'

const SavingsCard = () => {
  const { data, isLoading, isError } = useSavingsOpportunities() 
    return (    
        <MetricCard
            label="Savings Opportunities" 
            value={data ? `£${data.savings.toLocaleString()}` : '—'}
            trend={data ? `${data.savings} identified` : '—'}
            trendDirection="down"
            upIsBad
            glow="green"
            isLoading={isLoading}
            isError={isError} 
        /> 
    ) 
}

export default SavingsCard