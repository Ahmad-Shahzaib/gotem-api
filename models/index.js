const {
	User,
	UserRole,
	DriverType,
	DriverStatus,
	UserAssigned,
	UserEndorsements,
	Endorsements,
} = require('./user.model');
const { Truck, TruckType, TrailerLength, Equipment, TruckEquipment } = require('./truck.model');
const { Load, LoadType, LoadStatus } = require('./load.model');
const { Broker } = require('./broker.model');

TruckType.hasMany(Truck);
Truck.belongsTo(TruckType);

TrailerLength.hasMany(Truck);
Truck.belongsTo(TrailerLength);

UserRole.hasMany(User);
User.belongsTo(UserRole);

DriverType.hasMany(User);
User.belongsTo(DriverType);

DriverStatus.hasMany(User);
User.belongsTo(DriverStatus);

Truck.hasMany(User);
User.belongsTo(Truck);

LoadType.hasMany(Load);
Load.belongsTo(LoadType);

LoadStatus.hasMany(Load);
Load.belongsTo(LoadStatus);

Broker.hasMany(Load);
Load.belongsTo(Broker);

User.hasMany(Load, { foreignKey: 'driverId' });
Load.belongsTo(User, { foreignKey: 'driverId' });

User.hasMany(Load, { foreignKey: 'dispatcherId' });
Load.belongsTo(User, { foreignKey: 'dispatcherId' });

User.hasMany(UserAssigned, { onDelete: 'cascade', foreignKey: 'assignedId' });
UserAssigned.belongsTo(User);

User.belongsToMany(Endorsements, {
	through: UserEndorsements,
	onDelete: 'cascade',
	as: 'endorsements',
});
Endorsements.belongsToMany(User, { through: UserEndorsements, as: 'user' });

Truck.belongsToMany(Equipment, {
	through: TruckEquipment,
	onDelete: 'cascade',
	as: 'equipment',
});
Equipment.belongsToMany(Truck, { through: TruckEquipment, as: 'truck' });

module.exports = {
	User,
	Truck,
	TruckType,
	TrailerLength,
	Equipment,
	TruckEquipment,
	DriverStatus,
	DriverType,
	UserAssigned,
	Load,
	LoadType,
	LoadStatus,
	Broker,
};
