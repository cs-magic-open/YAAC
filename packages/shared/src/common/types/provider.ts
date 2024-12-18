import { APP_NAME } from "@/common/constants";
import { BaseLogger, ConsoleLogger } from "@/common/utils/logger";
import { CommitResult, DiffResult } from "simple-git";
import { ResultDTO } from "./ResultDTO";
import { ResultAsync } from "neverthrow";

export type GenerateCommitInput = {
  /**
   * 用户提交的 Diff 信息
   */
  diff: DiffResult;
  /**
   * 用户选用的供应商模型
   */
  model: Model;
  /**
   * 其他用户配置
   */
  options?: {
    /**
     * 用户希望生成 commit 的语言
     */
    lang?: string;
  };
};

/**
 * AI Commit 的核心生成数据
 */
export type GenerateCommitResult = {
  title: string;
  body?: string;
  extra?: any;
};

/**
 * 供应商返回的错误
 */
export class GenerateCommitError extends Error {
  public readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "GenerateCommitError";
  }
}

/**
 * 供应商如果需要 Restful 接口的推荐 DTO
 */
export type GenerateCommitDTO = ResultDTO<GenerateCommitResult>;

/**
 * 供应商定义的模型 meta 信息，供用户候选
 */
export interface Model {
  providerId: string;
  id: string;
  name: string;
  description: string;

  /**
   * 一些供用户明确准确度、性能、成本的指标
   */
  metrics?: {
    accuracy: number;
    speed: number;
    cost: number;
  };
}

export abstract class BaseGenerateCommitProvider {
  /**
   * 可继承或重载的 logger
   */
  public logger: BaseLogger = new ConsoleLogger(APP_NAME);

  /**
   * 供应商 ID
   */
  abstract id: string;

  /**
   * 供应商名称
   */
  abstract displayName: string;

  /**
   * 供应商描述
   */
  abstract description: string;

  /**
   * 供应商模型列表，具体调用要在 @generateCommit 里 switch 实现
   */
  abstract models: Model[];

  /**
   * 核心调用
   * @param input
   */
  abstract generateCommit(
    input: GenerateCommitInput
  ): ResultAsync<GenerateCommitResult, GenerateCommitError>;
}
