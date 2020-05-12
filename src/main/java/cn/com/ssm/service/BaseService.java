package cn.com.ssm.service;

import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 *   基础公共的业务层接口
 * @param <T>  描述具体封装类型的泛型
 */
public interface BaseService<T> {

    /**
     *   根据条件分页查询数据
     * @param page  当前页
     * @param limit  每一页的数据条数
     * @param t  查询的条件
     * @return  分页插件的对象数据
     * @throws Exception
     */
    Map<String,Object> findPageByPramas(Integer page, Integer limit, T t) throws Exception;

    /**
     *   查询所有数据
     * @return  返回查询的数据集合
     * @throws Exception
     */
    List<T> findAll() throws Exception;

    /**
     *   根据主键id删除单个数据
     * @param id  主键id
     * @return  删除操作结果
     * @throws Exception
     */
    String removeByPrimaryKey(Integer id) throws Exception;

    /**
     *   根据多个主键id批量删除数据
     * @param ids  多个主键id的数组
     * @return  操作的数据条数
     * @throws Exception
     */
    String removeBatchByIds(Integer[] ids) throws Exception;

    /**
     *   添加数据
     * @param t  要添加的数据
     * @return  添加的操作结果
     * @throws Exception
     */
    String save(T t) throws Exception;

    /**
     *   动态修改数据
     * @param t 要修改的的数据对象
     * @return  修改的操作结果
     */
    String updByPrimaryKeySelective(T t) throws Exception;

    /**
     * 根据主键动态批量修改数据
     * @param ids   主键数组
     * @param t   要修改的的数据对象
     * @return  修改的操作结果
     */
    String updBatchByPrimaryKeySelective(Integer[] ids,T t)throws Exception;

    /**
     * 根据条件查询单条数据
     * @param t  参数
     * @return  查询结果
     */
    T findOneByPramas(T t)throws Exception;

    /**
     * 根据条件查询多条数据
     * @param t 查询条件
     * @return  查询结果
     */
    List<T> findManyByPramas(T t)throws Exception;

    /**
     * 根据条件查询数据条数（唯一性）
     * @param t   参数
     * @return      查询的结果
     */
    Long findTCountByPramas(T t)throws Exception;
}
