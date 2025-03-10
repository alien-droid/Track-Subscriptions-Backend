import aj from '../config/arcjet.js'

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1})
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) return res.status(429).json({error: 'Rate Limit Exceeded', message: 'Too many requests'})
            if (decision.reason.isBot()) return res.status(403).json({error: 'Bot Detected', message: 'Bot Detected'})
            
            return res.status(403).json({error: 'Access denied', message: 'Forbidden'})
        }
        next()
    } catch (error) {
        console.log(`Arcjet Error: ${error}`)
        next(error)
    }
}

export default arcjetMiddleware