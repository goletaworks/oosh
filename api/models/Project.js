module.exports = {
	identity: 'Project',
	datastore: 'locomongo',
	primaryKey: '_id',
	attributes: {
		_id: {
	       type: 'string',
		   columnName: '_id',
	       unique: true
	    },
		name: {
            type : 'STRING',
            minLength: 8,
			maxLength: 256,
			unique: true,
			required: true
        },
		path : {
			type : 'STRING',
            minLength: 4,
			maxLength: 256,
			unique: true,
			required: true
		},
        password: {
			type: 'STRING',
			minLength: 4,
			maxLength: 256,
			required: true
		},

        screens : {
			type: 'json',
			columnType: 'array'
		}
    },

	hasScreen : function(project, screenInfoOrId){
		var screenId = screenInfoOrId.id || screenInfoOrId;
		if(!project.screens){
			return false;
		}
		var screenFound = false;
		var found = project.screens.find(function(test){
			return test.id == screenId;
		});
		return screenFound ? true : false;
	},

	addScreen : function(project, screenInfoOrId, cb){
		sails.log.debug('addScreen');
		var screenInfo = typeof screenInfoOrId == 'object' ?
				screenInfoOrId : { id : screenInfoOrId, name : screenInfoOrId, host : '', areas : [] };

		if(!project.screens){
			project.screens = [];
		}

		// for new Sails/waterline (https://sailsjs.com/documentation/reference/waterline-orm/models/replace-collection):
		// this.screens.push(screenInfo);
		// return this.save(function(err, updates){
		// 	cb(updates);
		// });
		Project.replaceCollection(this.path, 'screens').members(screenInfo);
		Project.findOne({ path : this.path })
		.then(function(foundProject){
			delete foundProject.password;
			cb(foundProject);
		});
	},

	clean : function(projectPath){
        var cleaned = projectPath.replace(/[^a-zA-Z0-9_]/gm, '_').substr(0, 255);
        return cleaned;
    }
};
