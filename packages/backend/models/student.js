const mongoose = require("mongoose");
const { ComplaintSchema } = require("./complaint");
const Joi = require("joi");

const StudentSchema = {
	Name: String,
	EmailAddress: String,
	Password: String,
	MatNo: String,
	Department: String,
	Level: String,
	CourseOfStudy: String,
	Complaints: [mongoose.Schema(ComplaintSchema)]
};

const Student = mongoose.model("Student", StudentSchema);

// Validation function

function ValidateStudent(student) {
	const schema = {
		Name: Joi.string().required(),
		EmailAddress: Joi.string()
			.email()
			.required(),
		Password: Joi.string()
			.min(8)
			.required(),
		MatNo: Joi.string().required(),
		Department: Joi.string(),
		Level: Joi.string().required(),
		CourseOfStudy: Joi.string().required(),
		Complaints: Joi.string().required()
	};

	return Joi.validate(student, schema);
}

//Exports
module.exports = { Student, StudentSchema, ValidateStudent };
