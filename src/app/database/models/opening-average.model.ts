import { Model, DataTypes, type Sequelize } from 'sequelize';

interface OpeningAverageAttributes {
  id?: number;
  symbol: string;
  average: number;
  generationDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class OpeningAverage
  extends Model<OpeningAverageAttributes>
  implements OpeningAverageAttributes
{
  declare id: number;

  declare symbol: string;

  declare average: number;

  declare generationDate: Date;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof OpeningAverage {
    OpeningAverage.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        symbol: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
          field: 'SYMBOL',
        },
        average: {
          type: DataTypes.FLOAT,
          allowNull: false,
          field: 'AVERAGE',
        },
        generationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'GENERATIONDATE',
        },
      },
      {
        sequelize,
        modelName: 'OpeningAverage',
        tableName: 'Opening Average',
        timestamps: true,
        freezeTableName: true,
      }
    );

    return this;
  }
}

export default OpeningAverage;
