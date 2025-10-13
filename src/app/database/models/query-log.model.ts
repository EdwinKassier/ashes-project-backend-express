import { Model, DataTypes, type Sequelize } from 'sequelize';

interface QueryLogAttributes {
  id?: number;
  symbol: string;
  investment: number;
  generationDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class QueryLog extends Model<QueryLogAttributes> implements QueryLogAttributes {
  declare id: number;

  declare symbol: string;

  declare investment: number;

  declare generationDate: Date;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof QueryLog {
    QueryLog.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        symbol: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'SYMBOL',
        },
        investment: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'INVESTMENT',
        },
        generationDate: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'GENERATIONDATE',
        },
      },
      {
        sequelize,
        modelName: 'QueryLog',
        tableName: 'Logging',
        timestamps: true,
        freezeTableName: true,
      }
    );

    return this;
  }
}

export default QueryLog;
