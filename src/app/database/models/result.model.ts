import { Model, DataTypes, type Sequelize } from 'sequelize';

interface ResultAttributes {
  id?: number;
  query: string;
  numberOfCoins: number;
  profit: number;
  growthFactor: number;
  lambos: number;
  investment: number;
  symbol: string;
  generationDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class Result extends Model<ResultAttributes> implements ResultAttributes {
  declare id: number;

  declare query: string;

  declare numberOfCoins: number;

  declare profit: number;

  declare growthFactor: number;

  declare lambos: number;

  declare investment: number;

  declare symbol: string;

  declare generationDate: Date;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof Result {
    Result.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        query: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'QUERY',
        },
        numberOfCoins: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'NUMBERCOINS',
        },
        profit: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'PROFIT',
        },
        growthFactor: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'GROWTHFACTOR',
        },
        lambos: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'LAMBOS',
        },
        investment: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'INVESTMENT',
        },
        symbol: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'SYMBOL',
        },
        generationDate: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
          field: 'GENERATIONDATE',
        },
      },
      {
        sequelize,
        modelName: 'Result',
        tableName: 'Results',
        timestamps: true,
        freezeTableName: true,
      }
    );

    return this;
  }
}

export default Result;
