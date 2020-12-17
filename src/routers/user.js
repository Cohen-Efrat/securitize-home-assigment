const express = require('express')
const userModel = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const axios = require('axios').default;

router.get('/user',auth, async (req, res) => {
    res.status(200).send(req.user)
})

const shuffleArray = (array)=>{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

router.get('/tokens',auth, async (req, res) => {
    try {
        let tokens = await axios({
            method: 'get',
            url: `${process.env.BASE_URL}/tokens`,
        });
        tokens = tokens.data
        const {limit,page,sortBy,search} = req.query
        let result = tokens.slice((page - 1) * limit, page * limit)
        if(sortBy === 'tokenPrice'){
            result = result.sort((a, b) => (a.tokenPrice > b.tokenPrice) ? 1 : -1)
        }
        if(sortBy === 'tokenName'){
            result = result.sort((a, b) => (a.tokenName > b.tokenName) ? 1 : -1)
        }
        if(sortBy === 'random'){
            result = shuffleArray(result);
        }
        // or includes
        if(search){
            result = result.filter((token)=> token.tokenName === search || token.tokenSymbol === search )
        }
        res.status(200).send({result, totalItems: result.length})
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.post('/user/favorits', auth, async (req, res) => {
    try {
        const { token } = req.body
        req.user.favorites = [...req.user.favorites ,token]
        await req.user.save()
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/user/favorits', auth, async (req, res) => {
    const favorites = req.user.favorites
    const {limit,page} = req.query
    const result = favorites.slice((page - 1) * limit, page * limit)
    
    try {
        res.send({result, totalItems :result.length })
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/user/favorits/:tokenId', auth, async (req, res) => {
    try {
        req.user.favorites = req.user.favorites.filter((token)=> token.id === req.params.tokenId)
        await req.user.save()
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})




module.exports = router