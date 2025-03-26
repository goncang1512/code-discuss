/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EnhanceType, QuestionType, ReturnEnhanceType, User } from '@lib/utils/types';

class QnaServices {
	qna: QuestionType | null;
	user: User;
	loading: boolean;
	constructor(qna: QuestionType | null, user: User) {
		this.qna = qna;
		this.user = user;
		this.loading = false;
	}

	handleUpvote = async ({ formElement, formData }: EnhanceType) => {
		if (!this.qna) return;
		formData.append('user_id', this.user.id);
		formData.append('quest_id', this.qna?.id);
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
		formData.append('quest_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
			}
			update();
		};
	};

	handleDelete = async (
		{ formElement, formData }: EnhanceType,
		callbacks: {
			onRequest?: () => void;
			onSuccess?: () => void;
			onError?: (error: any) => void;
		} = {}
	) => {
		if (callbacks.onRequest) callbacks.onRequest();
		if (!this.qna) return;

		formData.append('quest_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
				if (callbacks.onSuccess) callbacks.onSuccess();
			}

			if (['error', 'failer'].includes(result.type)) {
				if (callbacks.onError) callbacks.onError(result);
			}
			update();
			this.loading = false;
		};
	};

	handleSolved = async ({ formElement, formData }: EnhanceType) => {
		if (!this.qna) return;

		formData.append('solved', String(this.qna.is_accepted ?? false));
		formData.append('quest_id', this.qna.id);
		return async ({ result, update }: ReturnEnhanceType) => {
			if (result.type === 'success') {
				formElement.reset();
				console.log(result);
				if (!this.qna) return;
				this.qna.is_accepted = result?.data?.results?.is_accepted as boolean;
			}
			update();
		};
	};
}

export default QnaServices;
