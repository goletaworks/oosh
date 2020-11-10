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

	addScreen : async function(project, screenInfoOrId, cb){
		sails.log.debug('addScreen');
		var screenInfo = typeof screenInfoOrId == 'object' ?
				screenInfoOrId : { id : screenInfoOrId, name : screenInfoOrId, host : '', areas : [] };

		project.screens = screenInfo;
		Project.update({ path : project.path })
		.set(project)
		.fetch()
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
