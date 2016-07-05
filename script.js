function Task(createbBy, name, sprint, assignee, createbBy, description, status, messages, updatedAt, createdAt) {
	this.id = Math.random().toString(36).substr(2, 9);
	this.name = name;
	this.sprint = sprint;
	this.assignee = assignee;
	this.createbBy = createbBy;
	this.description = description;
	this.status = status || 'New';
	this.messages = messages || [];
	this.updatedAt = updatedAt || new Date().getTime();
	this.createdAt = createdAt || new Date().getTime();
}

Task.prototype.update = function(property, value) {
	if (property === 'id') {
		return;
	}

	this[property] = value;	

	if (property !== 'updatedAt') {
		this.updatedAt = new Date().getTime();
	}
}
Task.prototype.getStatus = function() {
	return this.status;
}
Task.prototype.getSprint = function() {
	return this.sprint;
}
Task.prototype.getId = function() {
	return this.id;
}
Task.prototype.getName = function() {
	return this.name;
}
Task.prototype.getAssignee = function() {
	return this.assignee;
}
Task.prototype.getCreatedBy = function() {
	return this.createbBy;
}
Task.prototype.getDescription = function() {
	return this.description;
}
Task.prototype.getMessages = function() {
	return this.messages;
}
Task.prototype.getUpdatedAt = function() {
	return this.updatedAt;
}
Task.prototype.getCreatedAt = function() {
	return this.createdAt;
}

function Bug(createbBy, name, sprint, assignee, createbBy, description, status, messages, updatedAt, createdAt, tasks) {
	Task.call(this, createbBy);
	this.tasks = tasks || [];
}
Bug.prototype = new Task();
Bug.prototype.onUpdate = function(property, value) {
	var i;

	if (property === 'sprint') {
		for (i = 0; i < this.tasks.length; i++) {
			this.tasks[i].update(property, value);
		}
	}
}
Bug.prototype.addTask = function(task) {
	this.tasks.push(task);
}
Bug.prototype.removeTask = function(task) {
	this.tasks.slice(this.tasks.indexOf(task), 1);
}
Bug.prototype.getTasks = function(task) {
	return this.tasks;
}

function Feature() {
	
}
Feature.prototype = new Bug();


function Sprint() {
	this.tickets = [];
}
Sprint.prototype.addTicket = function(ticket) {
	this.tickets.push(ticket);
}
Sprint.prototype.removeTicket = function(ticket) {
	this.tickets.splice(this.tickets.indexOf(ticket), 1);
}
Sprint.prototype.getOverview = function(filter) {
	var tickets = this.tickets,
		i, status,
		result = {
			ticketsNo: tickets.length,
			bugsNo: 0,
			featuresNo: 0,
			tasksNo: 0,
			newNo: 0,
			inProgressNo: 0,
			readyForTestingNo: 0,
			feedbackNo: 0,
			reworkNo: 0,
			resolvedNo: 0
		};

	// here I should add recursive traversing for Bugs and features subtasks also to be returned in the overview
	for (i = 0; i < tickets.length; i++) {
		if (filter) {
			if (filter instanceof Sprint) {
				if (tickets[i].getSprint() !== filter) {
					continue;
				}
			}
			else if (tickets[i].getStatus() !== filter) {
				continue;
			}
		}

		if (tickets[i] instanceof Bug) {
			resutl.bugsNo++;
		}
		else if (tickets[i] instanceof Task) {
			resutl.tasksNo++;
		}
		else if (tickets[i] instanceof Feature) {
			resutl.featuresNo++;
		}

		status = tickets[i].getStatus();
		switch(status) {
    		case 'New':
        		resutl.newNo++;
        		break;
    		case 'In progress':
        		resutl.inProgressNo++;
        		break;

    		case 'Ready For Testing':
        		resutl.readyForTestingNo++;
        		break;

    		case 'Feedback':
    			resutl.feedbackNo++;
        		break;

    		case 'Rework':
        		resutl.reworkNo++;
        		break;

    		case 'Resolved':
        		resutl.resolvedNo++;
        		break;
		}
	}

	return result;
}

var app = {
	sprints: [],

	createSprint: function() {
		var sprint = new Sprint();
		this.sprints.push(sprint);
		
		return sprint;
	},

	addTicket: function(type, createbBy, name, sprint, assignee, createbBy, description, status, messages, updatedAt, createdAt, tasks) {
		var ticket;

		switch(type) {
    		case 'bug':
        		ticket = new Bug(createbBy, name, sprint, assignee, createbBy, description, status, messages, updatedAt, createdAt, tasks);
        		break;
    		case 'feature':
        		ticket = new Feature(createbBy, name, sprint, assignee, createbBy, description, status, messages, updatedAt, createdAt, tasks);
        		break;
    		default:
    			ticket = new Task(createbBy, name, sprint, assignee, createbBy, description, status, messages, updatedAt, createdAt);
		}

		this.sprints[this.sprints.indexOf(sprint)].addTicket(ticket);
	},

	getOverview: function(filter) {
		var sprintObj,
		i, sprint,
		result = [];

		for (i = 0; i < this.sprints.length; i++) {
			result.push(this.sprints[i].getOverview(filter));
		}

		return result;
	},

	filter: function(filter) {
		return this.getOverview(filter);
	}
};