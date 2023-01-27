const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

// Add get user sites func

async function query(filterBy = { owner: '' }) {
    try {
        const collection = await dbService.getCollection('wap')

        if (filterBy.owner) {
            let waps = await collection.find({ owner: filterBy.owner }).toArray()
            waps = waps.reduce((acc, wap) => {
                acc.push({
                    _id: wap._id,
                    leadsBoards: wap.leadsBoards,
                    subscribers: wap.subscribers,
                    msgs: wap.msgs,
                    title: wap.title,
                    thumbnail: wap.thumbnail,
                    schedule: wap.schedule,
                })
                return acc
            }, [])
            return waps
        }
        const waps = await collection.find({}).toArray()
        return waps
    } catch (err) {
        logger.error('cannot find waps', err)
        throw err
    }
}

async function getById(wapId) {
    // can be merged to one func with getByUrl
    console.log(wapId)
    try {
        const collection = await dbService.getCollection('wap')
        const wap = collection.findOne({ _id: ObjectId(wapId) })
        return wap
    } catch (err) {
        logger.error(`while finding wap ${wapId}`, err)
        throw err
    }
}

async function getByUrl(url) {
    try {
        const collection = await dbService.getCollection('wap')
        const wap = collection.findOne({ url })
        return wap
    } catch (err) {
        logger.error(`Cannot find wap by url ${url}`, err)
        throw err
    }
}

async function remove(wapId) {
    try {
        const collection = await dbService.getCollection('wap')
        await collection.deleteOne({ _id: ObjectId(wapId) })
        return wapId
    } catch (err) {
        logger.error(`cannot remove wap ${wapId}`, err)
        throw err
    }
}

async function add(wap) {
    try {
        const collection = await dbService.getCollection('wap')
        wap.owner = 'guest'
        await collection.insertOne(wap)
        return wap
    } catch (err) {
        logger.error('cannot insert wap', err)
        throw err
    }
}

async function update(wap) {
    try {
        const wapToSave = {
            url: wap.url,
            cmps: wap.cmps,
            leadsBoards: wap.leadsBoards,
            owner: wap.owner,
            title: wap.title,
            subscribers: wap.subscribers,
            chatStartingMsg: wap.chatStartingMsg,
            msgs: wap.msgs,
            schedule: wap.schedule,
        }
        console.log(wapToSave)
        const collection = await dbService.getCollection('wap')
        await collection.updateOne({ _id: ObjectId(wap._id) }, { $set: wapToSave })
        return wap
    } catch (err) {
        logger.error(`cannot update wap ${wap._id}`, err)
        throw err
    }
}

// async function addCarMsg(wapId, msg) {
//     try {
//         msg.id = utilService.makeId()
//         const collection = await dbService.getCollection('wap')
//         await collection.updateOne({ _id: ObjectId(carId) }, { $push: { msgs: msg } })
//         return msg
//     } catch (err) {
//         logger.error(`cannot add car msg ${carId}`, err)
//         throw err
//     }
// }

// async function removeCarMsg(carId, msgId) {
//     try {
//         const collection = await dbService.getCollection('wap')
//         await collection.updateOne({ _id: ObjectId(carId) }, { $pull: { msgs: {id: msgId} } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot add car msg ${carId}`, err)
//         throw err
//     }
// }

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    getByUrl,
    // addCarMsg,
    // removeCarMsg
}
