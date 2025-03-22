import type { EnhanceType, QuestionType, ReturnEnhanceType, User } from '@lib/utils/types';

class QnaServices {
	qna: QuestionType;
	user: User;
	constructor(qna: QuestionType, user: User) {
		this.qna = qna;
		this.user = user;
	}

	handleUpvote = async ({ formElement, formData }: EnhanceType) => {
		formData.append('user_id', this.user.id);
		formData.append('quest_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
			}
			update();
		};
	};

	handleDownVote = async ({ formElement, formData }: EnhanceType) => {
		formData.append('user_id', this.user.id);
		formData.append('quest_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
			}
			update();
		};
	};

	handleDelete = async ({ formElement, formData }: EnhanceType) => {
		formData.append('quest_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
			}
			update();
		};
	};

	handleSolved = async ({ formElement, formData }: EnhanceType) => {
		formData.append('solved', String(this.qna.is_accepted ?? false));
		formData.append('quest_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
				console.log(result);
				this.qna.is_accepted = result?.data?.results?.is_accepted as boolean;
			}
			update();
		};
	};
}

export default QnaServices;
