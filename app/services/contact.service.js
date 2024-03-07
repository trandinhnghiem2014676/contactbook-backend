const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client){
        this.Contact = client.db().collection("contacts");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    //định nghĩa trong lớp ContactService (app/services/contact.service.js)
    extractConactData(payload){
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };
        // Remove undeined fields
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }
    //
    async create(payload) {
        const contact = this.extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $set: { favorite: contact.favorite === true}},
            {returnDocument: "after", upsert: true}
        );
        return result;
    }
    // dinh nghia contactService.fine vaf contactService.findByName
    async find(filter){
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i"},
        });
    }
    // dinh nghia contactService.findById(id)
    async findById(id) {
        return await this.Contact.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    // dinh nghia contactService.update(id, document)
    async update(id, payload) {
        const filter = {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
        filter,
        { $set: update },
        { returnDocument: "after" }
        );
        return result;
    }
    //dinh nghia contactService.delete(id)
    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    // dinh nghia findFavorite()
    async findFavorite() {
        return await this.find({ favorite: true });
    }
    // dinh nghia contactService.deleteMany()
    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ContactService;