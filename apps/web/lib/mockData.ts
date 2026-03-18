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
    lastSynced: string
}
export const mockAnomaliesResponse: AnomaliesResponse[] = [
  {
    id: '1',
    title: 'Unexpected increase in S3 costs',
    description: 'Your S3 costs have increased by 30% compared to the previous week.',
    severity: 'warning',
    lastSynced: '2026-03-17T10:00:00Z',
  },
  {
    id: '2',
    title: 'EC2 instances running at low utilization',
    description: 'Several EC2 instances have been running at less than 10% CPU utilization for the past 7 days.',
    severity: 'critical',
    lastSynced: '2026-03-17T08:00:00Z',
  },
  {
    id: '3',
    title: 'New resource detected',
    description: 'A new RDS instance was detected in your account.',
    severity: 'info',
    lastSynced: '2026-03-17T05:00:00Z',
  },
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

export interface CostRowResponse {
  id: string
  serviceName: string
  providerName: string
  regionName: string
  chargeType: string
  effectiveCost: number
  billedCost: number
  billingPeriodStart: string
  resourceName: string
}

export const mockCostRows: CostRowResponse[] = [
  { id: '1', serviceName: 'Amazon EC2', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Usage', effectiveCost: 1800, billedCost: 2000, billingPeriodStart: '2026-03-01', resourceName: 'prod-api-server' },
  { id: '2', serviceName: 'Amazon S3', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Usage', effectiveCost: 420, billedCost: 420, billingPeriodStart: '2026-03-01', resourceName: 'costprism-data-lake' },
  { id: '3', serviceName: 'Amazon RDS', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Usage', effectiveCost: 980, billedCost: 1100, billingPeriodStart: '2026-03-01', resourceName: 'prod-postgres' },
  { id: '4', serviceName: 'AWS Lambda', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Usage', effectiveCost: 45, billedCost: 45, billingPeriodStart: '2026-03-01', resourceName: 'pipeline-worker' },
  { id: '5', serviceName: 'Amazon CloudFront', providerName: 'AWS', regionName: 'global', chargeType: 'Usage', effectiveCost: 210, billedCost: 210, billingPeriodStart: '2026-03-01', resourceName: 'cdn-distribution' },
  { id: '6', serviceName: 'Amazon EKS', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Usage', effectiveCost: 650, billedCost: 650, billingPeriodStart: '2026-03-01', resourceName: 'prod-cluster' },
  { id: '7', serviceName: 'AWS Savings Plan', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Purchase', effectiveCost: -200, billedCost: 0, billingPeriodStart: '2026-03-01', resourceName: 'compute-savings-plan' },
  { id: '8', serviceName: 'Amazon ElastiCache', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Usage', effectiveCost: 180, billedCost: 180, billingPeriodStart: '2026-03-01', resourceName: 'redis-cache' },
  { id: '9', serviceName: 'AWS WAF', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Fee', effectiveCost: 55, billedCost: 55, billingPeriodStart: '2026-03-01', resourceName: 'waf-ruleset' },
  { id: '10', serviceName: 'Amazon SES', providerName: 'AWS', regionName: 'eu-west-1', chargeType: 'Usage', effectiveCost: 12, billedCost: 12, billingPeriodStart: '2026-03-01', resourceName: 'transactional-email' },
]