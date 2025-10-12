import { Model, DataTypes } from 'sequelize';

class QueryLog extends Model {
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
