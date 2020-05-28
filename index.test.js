const cls = require('./index')
const chai = require('chai');
const { expect } = chai;

describe('CLS', function () {

    it('will maintain a value', async function () {
        
        cls.something = 1
        await new Promise(resolve => setTimeout(resolve, 100))
        expect(cls.something).to.eq(1)
        await (async () => {
            await new Promise(resolve => setTimeout(resolve, 10))
            expect(cls.something).to.eq(1)
        })()

    });
    it('will lose values set in a sub function', async function () {
        cls.something = 1
        await new Promise(resolve => setTimeout(resolve, 100))
        expect(cls.something).to.eq(1)
        await (async () => {
            cls.something = 2

        })()
        expect(cls.something).to.eq(1)
    })
    it("will keep the value if hold context was set", async function () {
        cls.$init()
        cls.something = 1
        await new Promise(resolve => setTimeout(resolve, 100))
        expect(cls.something).to.eq(1)
        await (async () => {
            cls.something = 2

        })()
        expect(cls.something).to.eq(2)
    })
})
