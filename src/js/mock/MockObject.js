import merge from 'lodash/merge';

/**
 * This class is used only for the prototype. In the final app, the different data will be
 * represented by appropriate classes (like User, Conversation, Message, ...), but since we don't know
 * yet what they will be, the MockObject is used instead. Why not use a simple object then? To
 * clearly differentiate between, even in the final app, we expect an actual object, and we expect
 * that a specific class will be developed one day.
 *
 * You can use the MockObject as a regular object:
 * ```
 * const user = new MockObject();
 * user.name = 'Test name';
 * ```
 *
 * You can also initialize the MockObject with an object.
 */
class MockObject {
	constructor(init = {}) {
		merge(this, init);
	}
}

export default MockObject;
