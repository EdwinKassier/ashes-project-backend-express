import { Model, DataTypes } from 'sequelize';

class Result extends Model {
  static init(sequelize) {
    super.init(
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
