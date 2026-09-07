# 技术栈与官方岗位参考

核对日期：2026-09-07。岗位网页可能更新或下线。本页是内容维护依据，不作为个人完成这些工作的证明。

## 当前展示

- 工作经验：C++ / Linux、零拷贝 IPC、模型量化与端侧部署。Git、Gerrit、Docker、CI/CD 管线、NVIDIA Orin 由作者本轮明确补充；设备系列写为 Orin，未推断具体型号、板卡或 JetPack 版本。
- 项目实践：LLM 流式测量、负载调度、PyTorch 预训练、CLIP 研究和 Coding Agent Runtime。
- 在研：vLLM、KV Cache、PagedAttention、Continuous Batching；SGLang / TensorRT-LLM 标为后续拓展。
- 计划实践：缓存与批调度优化、投机解码、CUDA / Triton、FlashAttention、LLM 量化、Nsight、分布式推理与后训练。没有据此新增已完成的 kernel、集群、性能指标或生产部署经历。

## 官方参考

1. [百度：大模型推理架构研发工程师 J95970](https://talent.baidu.com/jobs/detail/SOCIAL/495f5822-a881-4285-bf30-3bc5b1e376b1)，页面日期 2026-07-21。覆盖推理框架、Attention 与批处理、低比特量化、通信重叠及 PD 分离；据此组织缓存、调度、量化和分布式方向。
2. [百度：AI infra 推理工程师 J101235](https://talent.baidu.com/jobs/detail/GRADUATE/7753cdb4-70b0-462b-a634-ee53818c7c9a)，页面日期 2026-07-21。覆盖 C++/Python、GPU 编程、推理引擎与系统优化；这里参考技能结构，不表示作者符合该校招身份条件。
3. [NVIDIA：Senior Software Engineer – TensorRT Edge-LLM, JR2012868](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/Senior-Software-Engineer---TensorRT-Edge-LLM_JR2012868)。官方索引可核对 C++ 自回归服务、KV Cache、MoE、投机解码、CUDA 与性能分析要求；页面正文为动态加载，未将岗位开放状态作为确定事实。
4. [字节跳动 Seed Infrastructures](https://seed.bytedance.com/zh/direction/infrastructures)。官方团队页确认高性能推理、分布式训练、RL 框架与异构编译器方向，并链接推理引擎岗位；具体岗位详情未完整获取，不将转载 JD 当作官方要求。

## 表述原则

工作中使用 NVIDIA Orin 不自动等于 CUDA kernel 或 TensorRT-LLM 的研发经验。端侧模型量化与 LLM 的 AWQ/GPTQ 实践也分别展示。后续有可复现代码、日志和实验结果时，再将对应条目从计划升级为项目实践。
