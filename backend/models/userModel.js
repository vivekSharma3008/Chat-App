const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        name: { type: "String", required: true },
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true },
        pic: {
            type: "String",
            required: true,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestaps: true }
);

userSchema.methods.matchPassword = async function(enteredPassword){
    return (await bcryptjs.compare(enteredPassword, this.password))
}

userSchema.pre("save", async function(next){
    if(this.modified){
        next();
    }

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);

module.exports = User;