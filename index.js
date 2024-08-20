const hooks = require( 'async_hooks' )

const cls = {}
let current = {}
const HOLD = "$HOLD"

hooks
    .createHook( {
        init ( asyncId, type, triggerId ) {
            let existing = cls[ triggerId ] || {}
            cls[ asyncId ] = existing[HOLD] ? existing : { ...existing, _parent: existing}
        },
        before ( id ) {
            current = cls[ id ] = cls[id] || {}
        },
        after () {
            current = {}
        },
        destroy ( id ) {
            delete cls[ id ]
        },
    } )
    .enable()

function getCurrent () {
    return current
}
module.exports = new Proxy( getCurrent, {
    get ( obj, prop ) {
        if ( prop === '$hold' ) return function(hold) {
            current[HOLD] = !!hold
        }
        if( prop=== '$init') return function(fn) {
            current && (current[HOLD] = true)
            if(fn) {
                return function(...params) {
                    current && (current[HOLD] = true)
                    return fn(...params)
                }
            }
        }
        if ( current ) {
            return current[ prop ]
        }

    },
    set ( obj, prop, value ) {
        if ( current ) {
            current[ prop ] = value
            return true
        } else {
            return false
        }

    },
    has ( obj, prop ) {
        return prop in current
    },
} )


