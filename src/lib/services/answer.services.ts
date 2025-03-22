import type { AnswerType, EnhanceType, ReturnEnhanceType, User } from '@lib/utils/types';

class AnswerServices {
	qna: AnswerType | null;
	user: User;
	constructor(qna: AnswerType | null, user: User) {
		this.qna = qna;
		this.user = user;
	}

	handleDelete = async ({ formElement, formData }: EnhanceType) => {
		if (!this.qna) return;

		formData.append('answer_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
			}
			update();
		};
	};

	handleSolved = async ({ formElement, formData }: EnhanceType) => {
		if (!this.qna) return;

		formData.append('solved', String(this.qna.is_answer ?? false));
		formData.append('answer_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
				console.log(result);
				if (!this.qna) return;
				this.qna.is_answer = result?.data?.results?.is_answer as boolean;
			}
			update();
		};
	};
	handleUpvote = async ({ formElement, formData }: EnhanceType) => {
		if (!this.qna) return;
		formData.append('user_id', this.user.id);
		formData.append('answer_id', this.qna?.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
			}
			update();
		};
	};
	handleDownVote = async ({ formElement, formData }: EnhanceType) => {
		if (!this.qna) return;

		formData.append('user_id', this.user.id);
		formData.append('answer_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
			}
			update();
		};
	};
}

export default AnswerServices;
