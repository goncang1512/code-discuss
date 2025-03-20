import type { EnhanceType, ReturnEnhanceType } from '@lib/utils/types';

class QnaServices {
	async delete({ formElement, formData }: EnhanceType) {
		formData.append('user_id', $user.id);
		formData.append('quest_id', qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
			}
			update();
		};
	}
}

export default QnaServices;
