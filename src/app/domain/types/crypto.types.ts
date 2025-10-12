// Service return types
export interface CryptoAnalysisData {
  symbol: string;
  investment: number;
  numberOfCoins: number;
  profit: number;
  growthFactor: number;
  lambos: number;
}

export interface OpeningAverageData {
  symbol: string;
  openingAverage: number;
  calculatedAt: Date;
}

export interface GraphData {
  symbol: string;
  data: GraphDataPoint[];
  timeframe: string;
}

export interface GraphDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface QueryLogData {
  id?: number;
  symbol: string;
  investment: number;
  createdAt?: Date;
}

// Repository interfaces
export interface ICryptoResultRepository {
  findBySymbol(symbol: string): Promise<CryptoAnalysisData | null>;
  create(data: Partial<CryptoAnalysisData>): Promise<CryptoAnalysisData>;
  findAll(): Promise<CryptoAnalysisData[]>;
}

export interface IOpeningAverageRepository {
  findBySymbol(symbol: string): Promise<OpeningAverageData | null>;
  create(data: Partial<OpeningAverageData>): Promise<OpeningAverageData>;
  update(symbol: string, data: Partial<OpeningAverageData>): Promise<void>;
}

export interface IQueryLogRepository {
  create(symbol: string, investment: number): Promise<void>;
  findRecent(limit: number): Promise<QueryLogData[]>;
}

// Service interfaces
export interface ICryptoDataService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchOHLCData(symbol: string): Promise<any>;
  checkSymbolExists(symbol: string): Promise<boolean>;
}

export interface ICryptoCacheService {
  getOpeningAverage(symbol: string): Promise<number | null>;
  setOpeningAverage(symbol: string, value: number): Promise<void>;
  getResult(symbol: string, investment: number): Promise<CryptoAnalysisData | null>;
  setResult(
    symbol: string,
    investment: number,
    data: CryptoAnalysisData
  ): Promise<void>;
}

export interface ICryptoAnalysisService {
  analyzeCrypto(symbol: string, investment: number): Promise<CryptoAnalysisData>;
}

export interface IGraphBuilderService {
  buildGraphData(symbol: string): Promise<GraphData>;
}
