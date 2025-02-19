const {
    DataTypes
  } = require('sequelize');
  
  module.exports = sequelize => {
    const attributes = {
        SalTrnId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: "SalTrnId"
        },
        Srno: {
          type: DataTypes.DOUBLE,
          field: "Srno"
        },
        Quality: {
            type: DataTypes.STRING(50),
            field: "Quality"
          },
        CatelogName: {
            type: DataTypes.STRING(150),
            field: "CatelogName"
          },
          ProductDescription: {
            type: DataTypes.STRING(100),
            field: "ProductDescription"
          },
          HSNCode: {
            type: DataTypes.DOUBLE,
            field: "HSNCode"
          },
          PkgType: {
            type: DataTypes.STRING(50),
            field: "PkgType"
          },
          Unit: {
            type: DataTypes.STRING(50),
            field: "Unit"
          },
          Qnty: {
            type: DataTypes.DOUBLE,
            field: "Qnty"
          },
          Rate: {
            type: DataTypes.DOUBLE,
            field: "Rate"
          },
          ItemGrossAmt: {
            type: DataTypes.DOUBLE,
            field: "ItemGrossAmt"
        },
        DisPer: {
            type: DataTypes.DOUBLE,
            field: "DisPer"
          },
          Discount: {
            type: DataTypes.DOUBLE,
            field: "Discount"
          },
          TaxableAmount: {
            type: DataTypes.DOUBLE,
            field: "TaxableAmount"
          },
          TaxRate: {
            type: DataTypes.DOUBLE,
            field: "TaxRate"
          },
          IGSTRate: {
            type: DataTypes.DOUBLE,
            field: "IGSTRate"
          },
          IGSTAmount: {
            type: DataTypes.DOUBLE,
            field: "IGSTAmount"
          },
          CGSTRate: {
            type: DataTypes.DOUBLE,
            field: "CGSTRate"
          },
          CGSTAmount: {
            type: DataTypes.DOUBLE,
            field: "CGSTAmount"
          },
          SGSTRate: {
            type: DataTypes.DOUBLE,
            field: "SGSTRate"
          },
          SGSTAmount: {
            type: DataTypes.DOUBLE,
            field: "SGSTAmount"
          }
    };
    const options = {
      tableName: "SaleTransactionDetails",
      comment: "",
      indexes: [],
      defaultScope: {
        order: [['Srno', 'ASC']]
      }
    };


    const SalDetModel = sequelize.define("SaleTransactionDetails", attributes, options);
    return SalDetModel;
  };