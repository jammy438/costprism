export interface TotalSpendResponse {
  currentSpend: number
  previousSpend: number
}  

export const mockTotalSpendResponse: TotalSpendResponse = {
    currentSpend: 12500,
    previousSpend: 10000
}

export interface SavingsResponse {
    savings: number
} 

export const mockSavingsResponse: SavingsResponse = {
    savings: 2500
}

export interface AnomaliesResponse {
    id: string,
    title: string,
    description: string,
    severity: 'warning' | 'critical' | 'info'
}
export const mockAnomaliesResponse: AnomaliesResponse[] = [{
    id: '1',
    title: 'Unexpected increase in S3 costs',
    description: 'Your S3 costs have increased by 30% compared to the previous week.',
    severity: 'warning'
}
, {
    id: '2',
    title: 'EC2 instances running at low utilization',
    description: 'Several EC2 instances have been running at less than 10% CPU utilization for the past 7 days.',
    severity: 'critical'
}
, {
    id: '3',
    title: 'New resource detected',
    description: 'A new RDS instance was detected in your account.',
    severity: 'info'
}

] 
export interface PipelineHealthResponse {
    successRate: number
    jobs: number
} 

export const mockPipelineHealthResponse: PipelineHealthResponse = {
    successRate: 92,
    jobs: 120
}

export interface SpendOverTimeResponse{
    date: string
    spend: number
} 
export const mockSpendOverTimeResponse: SpendOverTimeResponse[] = [
    { date: '2024-01-01', spend: 2000 },
    { date: '2024-01-02', spend: 2200 },
    { date: '2024-01-03', spend: 1800 },    
]

export interface ForecastResponse{
    date: string
    forecastedSpend: number
}

export const mockForecastResponse: ForecastResponse[] = [
    { date: '2024-01-01', forecastedSpend: 2100 },
    { date: '2024-01-02', forecastedSpend: 2300 },
    { date: '2024-01-03', forecastedSpend: 1900 },    
]

export interface SpendByProviderResponse{
    provider: string
    cost: number 
    sparklineData: number[]
}
export const mockSpendByProviderResponse: SpendByProviderResponse[] = [
    { provider: 'AWS', cost: 8000, sparklineData: [200, 220, 210, 240, 230] },
    { provider: 'Azure', cost: 3000, sparklineData: [100, 150, 120, 130, 110] },
    { provider: 'GCP', cost: 2000, sparklineData: [80, 90, 85, 95, 88] },
]   

export interface SpendByServiceResponse{ 
        service: string
        cost: number
        sparklineData: number[]
}

export const mockSpendByServiceResponse: SpendByServiceResponse[] = [
    { service: 'EC2', cost: 5000, sparklineData: [150, 160, 155, 170, 165] },
    { service: 'S3', cost: 3000, sparklineData: [100, 120, 110, 130, 125] },
    { service: 'RDS', cost: 2000, sparklineData: [80, 90, 85, 95, 88] },
]

export interface SpendByTeamResponse{
    team: string
    cost: number
    percentage: number
    sparklineData: number[]
} 

export const mockSpendByTeamResponse: SpendByTeamResponse[] = [
    { team: 'Frontend', cost: 4000, percentage: 40, sparklineData: [120, 130, 125, 140, 135] },
    { team: 'Backend', cost: 3500, percentage: 35, sparklineData: [100, 110, 105, 115, 108] },
    { team: 'Data Science', cost: 2500, percentage: 25, sparklineData: [80, 90, 85, 95, 88] },
]

export interface ConnectorsResponse{
        name: string
        status: 'connected' | 'error' | 'syncing'
        lastSynced: string
}

export const mockConnectorsResponse: ConnectorsResponse[] = [
    { name: 'AWS Connector', status: 'connected', lastSynced: '2024-01-01T12:00:00Z' },
    { name: 'Azure Connector', status: 'syncing', lastSynced: '2024-01-01T11:45:00Z' },
    { name: 'GCP Connector', status: 'error', lastSynced: '2024-01-01T11:30:00Z' },
]
