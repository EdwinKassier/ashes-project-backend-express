import { Model, DataTypes } from 'sequelize';

class OpeningAverage extends Model {
  static init(sequelize) {
    super.init(
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
