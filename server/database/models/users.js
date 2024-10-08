export default (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    });
    return Users;
};
